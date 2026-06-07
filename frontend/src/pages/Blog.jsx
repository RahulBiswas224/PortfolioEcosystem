// src/pages/Blog.jsx
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getPosts, getTags } from '../lib/api'

export default function Blog() {
  const [posts, setPosts]       = useState([])
  const [tags, setTags]         = useState([])
  const [meta, setMeta]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [params, setParams]     = useSearchParams()

  const activeTag    = params.get('tag') || ''
  const activeSearch = params.get('search') || ''
  const activePage   = parseInt(params.get('page') || '1')

  useEffect(() => {
    setLoading(true)
    const q = { limit: 10, page: activePage }
    if (activeTag)    q.tag    = activeTag
    if (activeSearch) q.search = activeSearch
    getPosts(q)
      .then(r => { setPosts(r.data); setMeta(r.meta) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [activeTag, activeSearch, activePage])

  useEffect(() => {
    getTags().then(setTags).catch(() => {})
  }, [])

  const setFilter = (key, val) => {
    const p = new URLSearchParams(params)
    if (val) p.set(key, val); else p.delete(key)
    p.delete('page')
    setParams(p)
  }

  return (
    <div className="max-w-page mx-auto px-12 pt-32 pb-20">
      <p className="text-xs font-medium tracking-widest uppercase text-text3 mb-8">Writing</p>

      {/* Search */}
      <input
        type="text"
        placeholder="Search posts…"
        defaultValue={activeSearch}
        onKeyDown={e => e.key === 'Enter' && setFilter('search', e.target.value)}
        className="w-full bg-bg2 border border-border rounded-lg px-3.5 py-2.5 text-sm font-light text-text placeholder-text3 outline-none focus:border-border2 transition-colors mb-4"
      />

      {/* Tags filter */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter('tag', '')}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${!activeTag ? 'border-border2 text-text' : 'border-border text-text3 hover:border-border2 hover:text-text2'}`}
          >
            All
          </button>
          {tags.map(t => (
            <button
              key={t.slug}
              onClick={() => setFilter('tag', t.slug)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${activeTag === t.slug ? 'border-border2 text-text' : 'border-border text-text3 hover:border-border2 hover:text-text2'}`}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {/* Posts */}
      {loading ? (
        <p className="text-sm text-text3">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-text3">No posts found.</p>
      ) : (
        <div className="flex flex-col">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className={`flex justify-between items-start py-5 border-b border-border hover:opacity-75 transition-opacity ${i === 0 ? 'border-t' : ''}`}
            >
              <div className="flex-1 pr-6">
                <p className="text-base font-medium text-text mb-1">{post.title}</p>
                {post.excerpt && <p className="text-sm font-light text-text2 leading-relaxed mb-2">{post.excerpt}</p>}
                <div className="flex flex-wrap gap-1.5">
                  {post.tags?.map(t => (
                    <span key={t.slug} className="text-2xs text-text3 px-2 py-0.5 rounded-full border border-border">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-text3 flex-shrink-0 pt-1">
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center gap-4 mt-8">
          {activePage > 1 && (
            <button onClick={() => setFilter('page', activePage - 1)}
              className="text-sm text-text2 hover:text-text transition-colors">← Prev</button>
          )}
          <span className="text-xs text-text3">{activePage} / {meta.totalPages}</span>
          {activePage < meta.totalPages && (
            <button onClick={() => setFilter('page', activePage + 1)}
              className="text-sm text-text2 hover:text-text transition-colors">Next →</button>
          )}
        </div>
      )}
    </div>
  )
}
