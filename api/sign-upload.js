import crypto from 'crypto'

// Allowed origins — update with your real Vercel domain before deploying
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

export default function handler(req, res) {
  setCorsHeaders(req, res)

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET

  if (!apiSecret || !uploadPreset) {
    return res.status(500).json({ error: 'Server misconfiguration: missing Cloudinary credentials' })
  }

  // Generate a timestamp valid for 10 minutes
  const timestamp = Math.round(Date.now() / 1000)

  // Parameters to sign — must match exactly what the frontend sends
  const paramsToSign = {
    timestamp,
    upload_preset: uploadPreset,
    folder: 'fashion-studio',
  }

  // Build the string to sign: sorted key=value pairs joined with &
  const signatureString =
    Object.keys(paramsToSign)
      .sort()
      .map(key => `${key}=${paramsToSign[key]}`)
      .join('&') + apiSecret

  const signature = crypto
    .createHash('sha256')
    .update(signatureString)
    .digest('hex')

  return res.status(200).json({
    signature,
    timestamp,
    uploadPreset,
    apiKey: process.env.VITE_CLOUDINARY_API_KEY ?? '',
    cloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME ?? '',
  })
}
