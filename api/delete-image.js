import crypto from 'crypto'

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.PRODUCTION_URL ?? null,
].filter(Boolean)

function setCorsHeaders(req, res) {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')
}

export default async function handler(req, res) {
  setCorsHeaders(req, res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { publicId } = req.body ?? {}

  if (!publicId || typeof publicId !== 'string') {
    return res.status(400).json({ error: 'publicId is required' })
  }

  // Only allow deleting images inside the fashion-studio folder
  if (!publicId.startsWith('fashion-studio/')) {
    return res.status(403).json({ error: 'Forbidden: can only delete images in the fashion-studio folder' })
  }

  const apiKey = process.env.VITE_CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME

  if (!apiKey || !apiSecret || !cloudName) {
    return res.status(500).json({ error: 'Server misconfiguration: missing Cloudinary credentials' })
  }

  const timestamp = Math.round(Date.now() / 1000)

  const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  const signature = crypto
    .createHash('sha256')
    .update(signatureString)
    .digest('hex')

  try {
    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id: publicId, signature, api_key: apiKey, timestamp }),
      }
    )

    const data = await cloudinaryRes.json()

    if (data.result === 'ok') {
      return res.status(200).json({ success: true })
    } else {
      return res.status(400).json({ error: data.result ?? 'Deletion failed' })
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Cloudinary' })
  }
}
