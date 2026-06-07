// routes/auth.js
'use strict'

const express = require('express')
const jwt     = require('jsonwebtoken')
const bcrypt  = require('bcryptjs')
const { db }  = require('../db')
const { requireAuth } = require('../middleware/auth')

const router       = express.Router()
const JWT_SECRET   = process.env.JWT_SECRET
const JWT_EXPIRES  = process.env.JWT_EXPIRES_IN || '7d'

// ── POST /api/auth/login ──────────────────────────────────────
// Body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }

    const author = await db.author.findUnique({ where: { email } })
    if (!author) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, author.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: author.id, email: author.email, name: author.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.status(200).json({
      token,
      expiresIn: JWT_EXPIRES,
      author: {
        id:         author.id,
        name:       author.name,
        email:      author.email,
        avatarUrl:  author.avatarUrl,
        bio:        author.bio,
      },
    })
  } catch (err) {
    console.error('POST /api/auth/login error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// ── GET /api/auth/me ──────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const author = await db.author.findUnique({
      where:  { id: req.user.id },
      select: {
        id: true, name: true, email: true,
        bio: true, avatarUrl: true,
        githubUrl: true, linkedinUrl: true, twitterUrl: true,
        createdAt: true,
        _count: { select: { posts: true } },
      },
    })
    if (!author) return res.status(404).json({ error: 'Author not found' })
    res.status(200).json(author)
  } catch (err) {
    console.error('GET /api/auth/me error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// ── PATCH /api/auth/me ────────────────────────────────────────
// Update own profile: name, bio, avatarUrl, social links, password
router.patch('/me', requireAuth, async (req, res) => {
  try {
    const { name, bio, avatarUrl, githubUrl, linkedinUrl, twitterUrl, password, currentPassword } = req.body

    const data = {}
    if (name        !== undefined) data.name        = name
    if (bio         !== undefined) data.bio         = bio
    if (avatarUrl   !== undefined) data.avatarUrl   = avatarUrl
    if (githubUrl   !== undefined) data.githubUrl   = githubUrl
    if (linkedinUrl !== undefined) data.linkedinUrl = linkedinUrl
    if (twitterUrl  !== undefined) data.twitterUrl  = twitterUrl

    // Password change — requires current password
    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'currentPassword is required to change password' })
      }
      const author = await db.author.findUnique({ where: { id: req.user.id } })
      const valid  = await bcrypt.compare(currentPassword, author.password)
      if (!valid) return res.status(401).json({ error: 'Current password is incorrect' })
      data.password = await bcrypt.hash(password, 10)
    }

    const updated = await db.author.update({
      where:  { id: req.user.id },
      data,
      select: {
        id: true, name: true, email: true,
        bio: true, avatarUrl: true,
        githubUrl: true, linkedinUrl: true, twitterUrl: true,
      },
    })

    res.status(200).json(updated)
  } catch (err) {
    console.error('PATCH /api/auth/me error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// ── POST /api/auth/register ───────────────────────────────────
// Create new author account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    const hashed = await bcrypt.hash(password, 10)
    const author = await db.author.create({
      data: { name, email, password: hashed },
    })

    const token = jwt.sign(
      { id: author.id, email: author.email, name: author.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.status(201).json({
      token,
      author: { id: author.id, name: author.name, email: author.email },
    })
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Email already registered' })
    }
    console.error('POST /api/auth/register error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router