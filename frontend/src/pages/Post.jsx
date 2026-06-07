// src/pages/Post.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPost } from '../lib/api'

// Same renderer as MarkdownEditor — keep in sync
function renderMarkdown(md) {
  if (!md) return ''
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-medium text-text mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 class="text-lg font-medium text-text mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 class="text-xl font-medium text-text mt-8 mb-4">$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,     '<strong class="text-text font-medium">$1</strong>')
    .replace(/\*(.+?)\*/g,         '<em class="italic text-text2">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="text-xs font-mono bg-border px-1.5 py-0.5 rounded text-amber">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-border2 pl-4 text-text2 italic my-4">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="border-border my-8"/>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-text underline underline-offset-2 hover:opacity-75" target="_blank" rel="noreferrer">$1</a>')
    .replace(/^\- (.+)$/gm, '<li class="text-sm text-text2 font-light ml-4 list-disc leading-relaxed">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="my-4 flex flex-col gap-1.5">$&</ul>')
    .replace(/\n\n([^<])/g, '\n\n<p class="text-sm text-text2 font-light leading-loose my-4">$1')
    .replace(/([^>])\n\n/g, '$1</p>\n\n')
    .replace(/\n/g, '<br/>')
}

export default function Post() {
  const { slug }              = useParams()
  const [post, setPost]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    setLoading(true)
    getPost(slug)
      .then(setPost)
      .catch(() => setError('Post not found'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="max-w-page mx-auto px-6 md:px-12 pt-32">
      <p className="text-sm text-text3">Loading…</p>
    </div>
  )

  if (error || !post) return (
    <div className="max-w-page mx-auto px-6 md:px-12 pt-32">
      <p className="text-sm text-text3 mb-4">Post not found.</p>
      <Link to="/blog" className="text-sm text-text2 hover:text-text transition-colors">← Back to blog</Link>
    </div>
  )

  return (
    <div className="max-w-page mx-auto px-6 md:px-12 pt-32 pb-20">
      <Link to="/blog" className="text-xs text-text3 hover:text-text2 transition-colors mb-10 inline-block">
        ← All posts
      </Link>

      {/* Cover image */}
      {post.coverImage && (
        <div className="w-full h-48 rounded-xl overflow-hidden border border-border mb-8">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.tags?.map(t => (
          <span key={t.slug} className="text-2xs text-text3 px-2 py-0.5 rounded-full border border-border">
            {t.name}
          </span>
        ))}
      </div>

      <h1 className="text-2xl font-medium text-text leading-tight tracking-tight mb-4">
        {post.title}
      </h1>

      <div className="flex items-center gap-3 mb-10 pb-8 border-b border-border">
        <span className="text-xs text-text3">{post.author?.name}</span>
        <span className="text-text3">·</span>
        <span className="text-xs text-text3">
          {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Rendered markdown */}
      <div
        className="max-w-none"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />

      <div className="mt-16 pt-8 border-t border-border flex justify-between items-center flex-wrap gap-4">
        <Link to="/blog" className="text-sm text-text2 hover:text-text transition-colors">
          ← Back to all posts
        </Link>
        <Link to={`/authors/${post.author?.id}`} className="text-sm text-text2 hover:text-text transition-colors">
          More by {post.author?.name} →
        </Link>
      </div>
    </div>
  )
}
