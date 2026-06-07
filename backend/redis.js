// redis.js
// Centralized Redis connection — shared by BullMQ and cache middleware
'use strict'

const { Redis } = require('ioredis')
require('dotenv').config()

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not set in environment variables')
}

// BullMQ requires maxRetriesPerRequest: null
const bullMQConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: { rejectUnauthorized: false },
})

// General cache client (normal settings)
const cacheClient = new Redis(process.env.REDIS_URL, {
  enableReadyCheck: false,
  tls: { rejectUnauthorized: false },
})

bullMQConnection.on('connect', () => console.log('✅ BullMQ Redis connected'))
bullMQConnection.on('error', (err) => console.error('❌ BullMQ Redis error:', err.message))
cacheClient.on('connect', () => console.log('✅ Cache Redis connected'))
cacheClient.on('error', (err) => console.error('❌ Cache Redis error:', err.message))

module.exports = { bullMQConnection, cacheClient }