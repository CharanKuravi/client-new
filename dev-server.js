/**
 * Local dev server — mirrors Vercel's serverless /api/* functions.
 * Run alongside Vite: `npm run dev:api`
 * Vite proxies /api/* → http://localhost:3001
 */

import 'dotenv/config'
import express from 'express'
import signUploadHandler from './api/sign-upload.js'
import deleteImageHandler from './api/delete-image.js'

const app = express()
app.use(express.json())

// Adapt Vercel-style handler (req, res) to Express
app.all('/api/sign-upload', (req, res) => signUploadHandler(req, res))
app.all('/api/delete-image', (req, res) => deleteImageHandler(req, res))

const PORT = 3001
app.listen(PORT, () => {
  console.log(`[dev-server] API running at http://localhost:${PORT}`)
})
