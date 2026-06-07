// db.js
// Centralized Prisma Client singleton — pure CJS (no import/export)
// Place this at: backend/db.js

'use strict'

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaNeon } = require('@prisma/adapter-neon')

const globalForPrisma = globalThis

function createClient() {
  const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
  })
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['error'],
  })
}

const db = globalForPrisma.__prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = db
}

async function disconnectDb() {
  await db.$disconnect()
}

module.exports = { db, disconnectDb }