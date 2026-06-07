'use strict'

const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { db, disconnectDb } = require('./db')
const { bullMQConnection, cacheClient } = require('./redis')
const { startEmailWorker } = require('./workers/emailWorker')
const { startBackgroundWorker } = require('./workers/backgroundWorker')

// Routes
const authRoutes    = require('./routes/auth')
const postRoutes    = require('./routes/posts')
const authorRoutes  = require('./routes/authors')
const tagRoutes     = require('./routes/tags')
const contactRoutes = require('./routes/contact')

const app = express()
const PORT = process.env.PORT || 5000

// app.use(cors())
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://portfolio-ecosystem-qdec.vercel.app',
  ],
  credentials: true,
}))
app.use(express.json())

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth',    authRoutes)
app.use('/api/posts',   postRoutes)
app.use('/api/authors', authorRoutes)
app.use('/api/tags',    tagRoutes)
app.use('/api/contact', contactRoutes)

// ─── Health — includes Redis status ──────────────────────────
app.get('/health', async (req, res) => {
  try {
    await cacheClient.ping()
    res.status(200).json({
      status: 'UP',
      redis: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    res.status(200).json({
      status: 'UP',
      redis: 'disconnected',
      timestamp: new Date().toISOString(),
    })
  }
})

// ─── 404 ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
})

// ─── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})

// ─── Start ────────────────────────────────────────────────────
async function start() {
  // Start BullMQ workers
  await startEmailWorker()
  await startBackgroundWorker()

  const server = app.listen(PORT, () => {
    console.log(`   Server running on http://localhost:${PORT}`)
    console.log(`   Routes: /api/auth | /api/posts | /api/authors | /api/tags | /api/contact`)
  })

  const shutdown = async (signal) => {
    console.log(`${signal} — shutting down gracefully`)
    server.close(async () => {
      await Promise.all([
        disconnectDb(),
        bullMQConnection.quit(),
        cacheClient.quit(),
      ])
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})