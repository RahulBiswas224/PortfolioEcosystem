// routes/posts.js — updated with cache + email queue
'use strict'

const express = require('express')
const { db } = require('../db')
const { requireAuth } = require('../middleware/auth')
const { cache, invalidateCache } = require('../middleware/cache')
const { queueNewPostEmail } = require('../queues')

const router = express.Router()

function formatPost(post) {
  return { ...post, tags: post.tags.map(t => t.tag) }
}

const postInclude = {
  author: { select: { id: true, name: true, avatarUrl: true } },
  tags: { include: { tag: { select: { name: true, slug: true } } } },
}

// GET /api/posts — cached for 60 seconds
router.get('/', cache(60), async (req, res) => {
  try {
    const { tag, author, search, page = 1, limit = 10, published = 'true' } = req.query

    const where = {}
    if (published !== 'all') where.published = published === 'true'
    if (tag)    where.tags   = { some: { tag: { slug: tag } } }
    if (author) where.authorId = author
    if (search) {
      where.OR = [
        { title:   { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    const pageNum  = Math.max(1, parseInt(page))
    const pageSize = Math.min(50, Math.max(1, parseInt(limit)))
    const skip     = (pageNum - 1) * pageSize

    const [posts, total] = await Promise.all([
      db.post.findMany({ where, orderBy: { publishedAt: 'desc' }, include: postInclude, skip, take: pageSize }),
      db.post.count({ where }),
    ])

    res.status(200).json({
      data: posts.map(formatPost),
      meta: { total, page: pageNum, limit: pageSize, totalPages: Math.ceil(total / pageSize) },
    })
  } catch (err) {
    console.error('GET /api/posts error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// GET /api/posts/:slug — cached for 120 seconds
router.get('/:slug', cache(120), async (req, res) => {
  try {
    const post = await db.post.findUnique({ where: { slug: req.params.slug }, include: postInclude })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.status(200).json(formatPost(post))
  } catch (err) {
    console.error('GET /api/posts/:slug error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// POST /api/posts — protected, queues email if published
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, slug, excerpt, content, coverImage, published, publishedAt, tags } = req.body
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'title, slug, and content are required' })
    }

    const post = await db.post.create({
      data: {
        title, slug,
        excerpt:     excerpt    ?? null,
        content,
        coverImage:  coverImage ?? null,
        published:   published  ?? false,
        publishedAt: published ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
        authorId:    req.user.id,
        tags: tags?.length
          ? { create: tags.map(tagId => ({ tag: { connect: { id: tagId } } })) }
          : undefined,
      },
      include: postInclude,
    })

    // Invalidate posts cache + queue email if published
    await invalidateCache('cache:/api/posts*')
    if (post.published) {
      await queueNewPostEmail({
        postTitle:  post.title,
        postSlug:   post.slug,
        authorName: post.author.name,
      })
    }

    res.status(201).json(formatPost(post))
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Slug already exists' })
    console.error('POST /api/posts error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// PATCH /api/posts/:slug — protected, author only
router.patch('/:slug', requireAuth, async (req, res) => {
  try {
    const existing = await db.post.findUnique({ where: { slug: req.params.slug } })
    if (!existing) return res.status(404).json({ error: 'Post not found' })
    if (existing.authorId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })

    const { title, slug, excerpt, content, coverImage, published, publishedAt, tags } = req.body

    const post = await db.post.update({
      where: { slug: req.params.slug },
      data: {
        ...(title      !== undefined && { title }),
        ...(slug       !== undefined && { slug }),
        ...(excerpt    !== undefined && { excerpt }),
        ...(content    !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(published  !== undefined && {
          published,
          publishedAt: published
            ? (publishedAt ? new Date(publishedAt) : existing.publishedAt ?? new Date())
            : null,
        }),
        ...(tags !== undefined && {
          tags: { deleteMany: {}, create: tags.map(tagId => ({ tag: { connect: { id: tagId } } })) },
        }),
      },
      include: postInclude,
    })

    await invalidateCache('cache:/api/posts*')
    res.status(200).json(formatPost(post))
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Slug already exists' })
    console.error('PATCH /api/posts/:slug error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// DELETE /api/posts/:slug — protected, author only
router.delete('/:slug', requireAuth, async (req, res) => {
  try {
    const existing = await db.post.findUnique({ where: { slug: req.params.slug } })
    if (!existing) return res.status(404).json({ error: 'Post not found' })
    if (existing.authorId !== req.user.id) return res.status(403).json({ error: 'Forbidden' })

    await db.post.delete({ where: { slug: req.params.slug } })
    await invalidateCache('cache:/api/posts*')
    res.status(200).json({ message: 'Post deleted successfully' })
  } catch (err) {
    console.error('DELETE /api/posts/:slug error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router