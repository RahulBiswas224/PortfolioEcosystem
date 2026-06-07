// routes/contact.js
// Public contact form — queues an email notification on submission
'use strict'

const express = require('express')
const { queueContactFormEmail } = require('../queues')

const router = express.Router()

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    console.log(req.body)
    const { name, email, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' })
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    if (message.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters' })
    }

    // Queue the email — don't await delivery, just enqueue
    await queueContactFormEmail({ name, email, message })

    res.status(200).json({ message: 'Message received. We will get back to you soon!' })
  } catch (err) {
    console.error('POST /api/contact error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

module.exports = router