// src/pages/Author.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAuthor } from '../lib/api'

export default function Author() {
  const { id }                  = useParams()
  const [author, setAuthor]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    setLoading(true)
    getAuthor(id)
      .then(setAuthor)
      .catch(() => setError('Author not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-page mx-auto px-6 md:px-12 pt-32">
      <p className="text-sm text-text3">Loading…</p>
    </div>
  )

  if (error || !author) return (
    <div className="max-w-page mx-auto px-6 md:px-12 pt-32">
      <p className="text-sm text-text3 mb-4">Author not found.</p>
      <Link to="/blog" className="text-sm text-text2 hover:text-text transition-colors">← Back to blog</Link>
    </div>
  )

  return (
    <div className="max-w-page mx-auto px-6 md:px-12 pt-32 pb-20">
      <Link to="/blog" className="text-xs text-text3 hover:text-text2 transition-colors mb-10 inline-block">
        ← Back
      </Link>

      {/* Author header */}
      <div className="flex items-start gap-4 mb-10 pb-10 border-b border-border">
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={author.name}
            className="w-14 h-14 rounded-full object-cover border border-border flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-border flex items-center justify-center flex-shrink-0">
            <span className="text-base font-medium text-text3">
              {author.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h1 className="text-xl font-medium text-text mb-1">{author.name}</h1>
          {author.bio && (
            <p className="text-sm font-light text-text2 leading-relaxed mb-3">{author.bio}</p>
          )}
          <p className="text-xs text-text3">
            {author.posts?.length || 0} published {author.posts?.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </div>

      {/* Posts by author */}
      {author.posts?.length > 0 ? (
        <>
          <p className="text-xs font-medium tracking-widest uppercase text-text3 mb-6">Writing</p>
          <div className="flex flex-col">
            {author.posts.map((post, i) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className={`flex justify-between items-start py-5 border-b border-border hover:opacity-75 transition-opacity ${i === 0 ? 'border-t' : ''}`}
              >
                <div className="flex-1 pr-6">
                  <p className="text-base font-medium text-text mb-1">{post.title}</p>
                  {post.excerpt && (
                    <p className="text-sm font-light text-text2">{post.excerpt}</p>
                  )}
                </div>
                <span className="text-xs text-text3 flex-shrink-0 pt-1">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-text3">No published posts yet.</p>
      )}
    </div>
  )
}
