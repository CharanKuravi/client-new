/**
 * Cloudinary upload utility
 *
 * Flow:
 * 1. Ask our own backend (/api/sign-upload) for a signed timestamp
 *    — the API secret never leaves the server
 * 2. POST the file directly to Cloudinary's upload endpoint
 * 3. Return the secure HTTPS URL + public_id (needed for future deletion)
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

/**
 * Upload a File object to Cloudinary via the signed-upload flow.
 * @param {File} file - The image file to upload
 * @returns {Promise<{ url: string, publicId: string }>}
 */
export async function uploadToCloudinary(file) {
  if (!file) throw new Error('No file provided')

  // Validate file type client-side before sending anything
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, GIF and AVIF images are allowed')
  }

  // 100 MB limit
  const MAX_SIZE = 100 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    throw new Error('Image must be under 100 MB')
  }

  // 1 — Get a fresh signature from our serverless function
  const signRes = await fetch('/api/sign-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!signRes.ok) {
    const err = await signRes.json().catch(() => ({}))
    throw new Error(err.error ?? 'Failed to get upload signature')
  }

  const { signature, timestamp, uploadPreset, apiKey, cloudName } = await signRes.json()

  // 2 — Upload directly to Cloudinary (browser → Cloudinary, not through our server)
  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', apiKey)
  formData.append('timestamp', String(timestamp))
  formData.append('signature', signature)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'fashion-studio')

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName ?? CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}))
    throw new Error(err.error?.message ?? 'Cloudinary upload failed')
  }

  const data = await uploadRes.json()

  return {
    url: data.secure_url,       // always HTTPS CDN URL
    publicId: data.public_id,   // e.g. "fashion-studio/abc123" — needed for deletion
  }
}

/**
 * Delete an image from Cloudinary via the backend.
 * @param {string} publicId - The Cloudinary public_id of the image
 */
export async function deleteFromCloudinary(publicId) {
  if (!publicId || publicId.startsWith('data:') || publicId.startsWith('http')) {
    // Not a Cloudinary publicId (could be a legacy base64 or external URL) — skip
    return
  }

  const res = await fetch('/api/delete-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    console.warn('Cloudinary delete failed:', err.error ?? 'unknown error')
    // Non-fatal — don't throw, the item is already removed from UI/state
  }
}
