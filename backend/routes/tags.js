// routes/tags.js
'use strict'

const express = require('express')
const { db } = require('../db')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

// GET /api/tags
router.get('/', async (req, res) => {
  try {
    const tags = await db.tag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    })
    res.status(200).json(tags)
  } catch (err) {
    console.error('GET /api/tags error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// GET /api/tags/:slug
router.get('/:slug', async (req, res) => {
  try {
    const tag = await db.tag.findUnique({
      where: { slug: req.params.slug },
      include: {
        posts: {
          include: { post: { select: { id: true, title: true, slug: true, excerpt: true, publishedAt: true, published: true } } },
        },
      },
    })
    if (!tag) return res.status(404).json({ error: 'Tag not found' })
    res.status(200).json({ ...tag, posts: tag.posts.map(p => p.post) })
  } catch (err) {
    console.error('GET /api/tags/:slug error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// POST /api/tags
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, slug } = req.body
    if (!name || !slug) return res.status(400).json({ error: 'name and slug are required' })
    const tag = await db.tag.create({ data: { name, slug } })
    res.status(201).json(tag)
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Tag with this name or slug already exists' })
    console.error('POST /api/tags error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// PATCH /api/tags/:slug
router.patch('/:slug', requireAuth, async (req, res) => {
  try {
    const { name, slug } = req.body
    const tag = await db.tag.update({
      where: { slug: req.params.slug },
      data: { ...(name !== undefined && { name }), ...(slug !== undefined && { slug }) },
    })
    res.status(200).json(tag)
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Tag not found' })
    if (err.code === 'P2002') return res.status(409).json({ error: 'Tag with this name or slug already exists' })
    console.error('PATCH /api/tags/:slug error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// DELETE /api/tags/:slug
router.delete('/:slug', requireAuth, async (req, res) => {
  try {
    await db.tag.delete({ where: { slug: req.params.slug } })
    res.status(200).json({ message: 'Tag deleted successfully' })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Tag not found' })
    console.error('DELETE /api/tags/:slug error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router