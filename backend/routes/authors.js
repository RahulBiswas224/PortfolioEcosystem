// routes/authors.js
'use strict'

const express = require('express')
const { db } = require('../db')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

// GET /api/authors
router.get('/', async (req, res) => {
  try {
    const authors = await db.author.findMany({
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, email: true, bio: true, avatarUrl: true, createdAt: true, _count: { select: { posts: true } } },
    })
    res.status(200).json(authors)
  } catch (err) {
    console.error('GET /api/authors error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// GET /api/authors/:id
router.get('/:id', async (req, res) => {
  try {
    const author = await db.author.findUnique({
      where: { id: req.params.id },
      include: { posts: { where: { published: true }, orderBy: { publishedAt: 'desc' }, select: { id: true, title: true, slug: true, excerpt: true, publishedAt: true } } },
    })
    if (!author) return res.status(404).json({ error: 'Author not found' })
    res.status(200).json(author)
  } catch (err) {
    console.error('GET /api/authors/:id error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// POST /api/authors
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, email, bio, avatarUrl } = req.body
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' })
    const author = await db.author.create({ data: { name, email, bio: bio ?? null, avatarUrl: avatarUrl ?? null } })
    res.status(201).json(author)
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Email already exists' })
    console.error('POST /api/authors error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// PATCH /api/authors/:id
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
    const { name, bio, avatarUrl } = req.body
    const author = await db.author.update({ where: { id: req.params.id }, data: { ...(name !== undefined && { name }), ...(bio !== undefined && { bio }), ...(avatarUrl !== undefined && { avatarUrl }) } })
    res.status(200).json(author)
  } catch (err) {
    console.error('PATCH /api/authors/:id error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// DELETE /api/authors/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) return res.status(403).json({ error: 'Forbidden' })
    await db.author.delete({ where: { id: req.params.id } })
    res.status(200).json({ message: 'Author deleted successfully' })
  } catch (err) {
    console.error('DELETE /api/authors/:id error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router