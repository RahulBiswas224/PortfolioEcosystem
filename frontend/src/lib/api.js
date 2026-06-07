// src/lib/api.js
// const BASE = '/api'
const BASE = (import.meta.env.VITE_API_URL || '') + '/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

// ── Posts ─────────────────────────────────────────────────────
export const getPosts  = (params = {}) => {
  const q = new URLSearchParams(params).toString()
  return request(`/posts${q ? `?${q}` : ''}`)
}
export const getPost   = (slug) => request(`/posts/${slug}`)
export const createPost = (data) =>
  request('/posts', { method: 'POST', body: JSON.stringify(data) })
export const updatePost = (slug, data) =>
  request(`/posts/${slug}`, { method: 'PATCH', body: JSON.stringify(data) })
export const deletePost = (slug) =>
  request(`/posts/${slug}`, { method: 'DELETE' })

// ── Authors ───────────────────────────────────────────────────
export const getAuthors = () => request('/authors')
export const getAuthor  = (id) => request(`/authors/${id}`)

// ── Tags ──────────────────────────────────────────────────────
export const getTags = () => request('/tags')

// ── Contact ───────────────────────────────────────────────────
export const sendContact = (body) =>
  request('/contact', { method: 'POST', body: JSON.stringify(body) })

// ── Auth ──────────────────────────────────────────────────────
export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })

export const getMe = () => request('/auth/me')

export const updateMe = (data) =>
  request('/auth/me', { method: 'PATCH', body: JSON.stringify(data) })