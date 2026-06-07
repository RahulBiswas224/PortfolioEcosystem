// src/lib/cloudinary.js
// Unsigned upload to Cloudinary — no backend needed for image hosting

const CLOUD_NAME    = 'dtgu0etvk'
const UPLOAD_PRESET = 'wwcztbsk'
const UPLOAD_URL    = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

/**
 * uploadImage(file) → { url, publicId }
 * Uploads directly from browser to Cloudinary using unsigned preset.
 */
export async function uploadImage(file) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('folder', 'portfolio')

  const res = await fetch(UPLOAD_URL, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Image upload failed')
  const data = await res.json()
  return {
    url:      data.secure_url,
    publicId: data.public_id,
  }
}