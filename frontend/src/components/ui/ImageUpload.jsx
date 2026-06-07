// src/components/ui/ImageUpload.jsx
import { useState, useRef } from 'react'
import { uploadImage } from '../../lib/cloudinary'

/**
 * ImageUpload
 * Props:
 *   value     — current image URL (string)
 *   onChange  — called with new URL after upload
 */
export default function ImageUpload({ value, onChange }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const inputRef              = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { url } = await uploadImage(file)
      onChange(url)
    } catch {
      setError('Upload failed — try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <div className="relative group w-full h-36 rounded-lg overflow-hidden border border-border">
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-black/70 text-text3 hover:text-text transition-colors opacity-0 group-hover:opacity-100"
          >
            Remove
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="w-full py-2.5 border border-dashed border-border2 rounded-lg text-sm text-text3 hover:border-[#444] hover:text-text2 transition-colors disabled:opacity-50"
      >
        {loading ? 'Uploading…' : value ? 'Replace image' : '+ Upload cover image'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
