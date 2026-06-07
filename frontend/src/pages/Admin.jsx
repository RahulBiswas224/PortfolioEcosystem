// src/pages/Admin.jsx
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { getPosts, deletePost, createPost, updatePost, updateMe } from '../lib/api'
import MarkdownEditor from '../components/ui/MarkdownEditor'
import ImageUpload from '../components/ui/ImageUpload'

const TABS = ['Posts', 'New Post', 'Profile']

export default function Admin() {
  const { user, signOut, signIn } = useAuth()
  const navigate                  = useNavigate()
  const [tab, setTab]             = useState('Posts')
  const [posts, setPosts]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [editing, setEditing]     = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchPosts()
  }, [user])

  const fetchPosts = () => {
    setLoading(true)
    getPosts({ limit: 100, published: 'all' })
      .then(r => setPosts(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const handleDelete = async (slug) => {
    if (!confirm(`Delete "${slug}"?`)) return
    try {
      await deletePost(slug)
      setPosts(p => p.filter(x => x.slug !== slug))
    } catch (err) { alert(err.message) }
  }

  const handleEdit = (post) => {
    setEditing(post)
    setTab('New Post')
  }

  const handleSaved = () => {
    setEditing(null)
    setTab('Posts')
    fetchPosts()
  }

  return (
    <div className="max-w-page mx-auto px-6 md:px-12 pt-28 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-text3 mb-0.5">Dashboard</p>
          <p className="text-sm text-text2">
            Welcome, <strong className="text-text font-medium">{user?.name}</strong>
          </p>
        </div>
        <button
          onClick={() => { signOut(); navigate('/') }}
          className="text-xs text-text3 hover:text-text2 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-8 border-b border-border">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); if (t !== 'New Post') setEditing(null) }}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px
              ${tab === t
                ? 'border-text text-text'
                : 'border-transparent text-text3 hover:text-text2'}`}
          >
            {t === 'New Post' && editing ? 'Edit Post' : t}
          </button>
        ))}
      </div>

      {/* Posts */}
      {tab === 'Posts' && (
        <div className="flex flex-col">
          {loading ? (
            <p className="text-sm text-text3 py-4">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-text3 py-4">No posts yet.</p>
          ) : posts.map((post, i) => (
            <div key={post.id}
              className={`flex justify-between items-center py-4 border-b border-border group ${i === 0 ? 'border-t' : ''}`}>
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-text truncate mb-0.5">{post.title}</p>
                <p className="text-xs text-text3">{post.slug}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs ${post.published ? 'text-green' : 'text-text3'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
                <button onClick={() => handleEdit(post)}
                  className="text-xs text-text3 hover:text-text transition-colors opacity-0 group-hover:opacity-100">
                  Edit
                </button>
                <Link to={`/blog/${post.slug}`}
                  className="text-xs text-text3 hover:text-text transition-colors opacity-0 group-hover:opacity-100">
                  View
                </Link>
                <button onClick={() => handleDelete(post.slug)}
                  className="text-xs text-text3 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New / Edit Post */}
      {tab === 'New Post' && (
        <PostForm
          key={editing?.id || 'new'}
          initial={editing}
          onSaved={handleSaved}
          onCancel={() => { setEditing(null); setTab('Posts') }}
        />
      )}

      {/* Profile */}
      {tab === 'Profile' && (
        <ProfileForm
          user={user}
          onSaved={(updated) => {
            const token = localStorage.getItem('token')
            signIn(token, { ...user, ...updated })
          }}
        />
      )}
    </div>
  )
}

// ── Post form ─────────────────────────────────────────────────
function PostForm({ initial, onSaved, onCancel }) {
  const isEdit = !!initial
  const [form, setForm] = useState({
    title:      initial?.title      || '',
    slug:       initial?.slug       || '',
    excerpt:    initial?.excerpt    || '',
    content:    initial?.content    || '',
    coverImage: initial?.coverImage || '',
    published:  initial?.published  ?? false,
  })
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(p => ({
    ...p, [k]: v,
    ...(!isEdit && k === 'title' && !p.slug
      ? { slug: v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
      : {}),
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      isEdit ? await updatePost(initial.slug, form) : await createPost(form)
      onSaved()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const inp = "w-full bg-bg2 border border-border rounded-lg px-3.5 py-2.5 text-sm font-light text-text placeholder-text3 outline-none focus:border-border2 transition-colors"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-xs font-medium tracking-widest uppercase text-text3 mb-1">
        {isEdit ? 'Edit Post' : 'New Post'}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-2xs text-text3 mb-1 block tracking-wider">TITLE</label>
          <input className={inp} placeholder="Post title"
            value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>
        <div>
          <label className="text-2xs text-text3 mb-1 block tracking-wider">SLUG</label>
          <input className={inp} placeholder="post-slug"
            value={form.slug} onChange={e => set('slug', e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="text-2xs text-text3 mb-1 block tracking-wider">EXCERPT</label>
        <input className={inp} placeholder="Short description (optional)"
          value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
      </div>
      <div>
        <label className="text-2xs text-text3 mb-1 block tracking-wider">COVER IMAGE</label>
        <ImageUpload value={form.coverImage} onChange={url => set('coverImage', url)} />
      </div>
      <div>
        <label className="text-2xs text-text3 mb-1 block tracking-wider">CONTENT</label>
        <MarkdownEditor value={form.content} onChange={v => set('content', v)} />
      </div>
      <label className="flex items-center gap-2.5 text-sm text-text2 cursor-pointer w-fit">
        <input type="checkbox" checked={form.published}
          onChange={e => set('published', e.target.checked)} className="accent-text w-3.5 h-3.5" />
        Publish immediately
      </label>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex items-center gap-4 pt-1">
        <button type="submit" disabled={loading}
          className="inline-flex items-center px-5 py-2 rounded-full bg-text text-bg text-sm hover:bg-[#d0d0d0] transition-colors disabled:opacity-50">
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create post'}
        </button>
        <button type="button" onClick={onCancel}
          className="text-sm text-text3 hover:text-text2 transition-colors">Cancel</button>
      </div>
    </form>
  )
}

// ── Profile form ──────────────────────────────────────────────
function ProfileForm({ user, onSaved }) {
  const [form, setForm] = useState({
    name:            user?.name        || '',
    bio:             user?.bio         || '',
    avatarUrl:       user?.avatarUrl   || '',
    githubUrl:       user?.githubUrl   || '',
    linkedinUrl:     user?.linkedinUrl || '',
    twitterUrl:      user?.twitterUrl  || '',
    currentPassword: '',
    password:        '',
    confirmPassword: '',
  })
  const [error, setError]     = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true); setError(null); setSuccess(false)
    try {
      const payload = {
        name:        form.name,
        bio:         form.bio,
        avatarUrl:   form.avatarUrl,
        githubUrl:   form.githubUrl,
        linkedinUrl: form.linkedinUrl,
        twitterUrl:  form.twitterUrl,
      }
      if (form.password) {
        payload.password        = form.password
        payload.currentPassword = form.currentPassword
      }
      const updated = await updateMe(payload)
      onSaved(updated)
      setSuccess(true)
      setForm(p => ({ ...p, currentPassword: '', password: '', confirmPassword: '' }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inp = "w-full bg-bg2 border border-border rounded-lg px-3.5 py-2.5 text-sm font-light text-text placeholder-text3 outline-none focus:border-border2 transition-colors"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <p className="text-xs font-medium tracking-widest uppercase text-text3">Profile</p>

      {/* Avatar */}
      <div>
        <label className="text-2xs text-text3 mb-1 block tracking-wider">PROFILE PICTURE</label>
        <div className="flex items-center gap-4">
          {form.avatarUrl ? (
            <img src={form.avatarUrl} alt="Avatar"
              className="w-14 h-14 rounded-full object-cover border border-border flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-border flex items-center justify-center flex-shrink-0">
              <span className="text-base font-medium text-text3">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1">
            <ImageUpload value={form.avatarUrl} onChange={url => set('avatarUrl', url)} />
          </div>
        </div>
      </div>

      {/* Name + Bio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-2xs text-text3 mb-1 block tracking-wider">NAME</label>
          <input className={inp} placeholder="Your name"
            value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div>
          <label className="text-2xs text-text3 mb-1 block tracking-wider">EMAIL</label>
          <input className={`${inp} opacity-50 cursor-not-allowed`}
            value={user?.email || ''} disabled />
        </div>
      </div>
      <div>
        <label className="text-2xs text-text3 mb-1 block tracking-wider">BIO</label>
        <textarea className={`${inp} resize-none h-20`} placeholder="Tell the world about yourself…"
          value={form.bio} onChange={e => set('bio', e.target.value)} />
      </div>

      {/* Social links */}
      <div>
        <label className="text-2xs text-text3 mb-2 block tracking-wider">SOCIAL LINKS</label>
        <div className="flex flex-col gap-2">
          {[
            { k: 'githubUrl',   ph: 'https://github.com/username' },
            { k: 'linkedinUrl', ph: 'https://linkedin.com/in/username' },
            { k: 'twitterUrl',  ph: 'https://twitter.com/username' },
          ].map(({ k, ph }) => (
            <input key={k} className={inp} placeholder={ph}
              value={form[k]} onChange={e => set(k, e.target.value)} />
          ))}
        </div>
      </div>

      {/* Password change */}
      <div>
        <label className="text-2xs text-text3 mb-2 block tracking-wider">CHANGE PASSWORD</label>
        <div className="flex flex-col gap-2">
          <input className={inp} type="password" placeholder="Current password"
            value={form.currentPassword} onChange={e => set('currentPassword', e.target.value)} />
          <input className={inp} type="password" placeholder="New password (min 8 chars)"
            value={form.password} onChange={e => set('password', e.target.value)} />
          <input className={inp} type="password" placeholder="Confirm new password"
            value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
        </div>
      </div>

      {error   && <p className="text-xs text-red-400">{error}</p>}
      {success && <p className="text-xs text-green">Profile updated ✓</p>}

      <div>
        <button type="submit" disabled={loading}
          className="inline-flex items-center px-5 py-2 rounded-full bg-text text-bg text-sm hover:bg-[#d0d0d0] transition-colors disabled:opacity-50">
          {loading ? 'Saving…' : 'Save profile'}
        </button>
      </div>
    </form>
  )
}