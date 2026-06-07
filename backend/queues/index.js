// queues/index.js
// Queue definitions — import these wherever you need to add jobs
'use strict'

const { Queue } = require('bullmq')
const { bullMQConnection } = require('../redis')

// Email notification queue
const emailQueue = new Queue('email', {
  connection: bullMQConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 100, // keep last 100 completed jobs
    removeOnFail: 200,
  },
})

// Background jobs queue
const backgroundQueue = new Queue('background', {
  connection: bullMQConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 50,
    removeOnFail: 100,
  },
})

// ── Helpers — add jobs cleanly from routes ────────────────────

async function queueNewPostEmail({ postTitle, postSlug, authorName }) {
  return emailQueue.add('new-post', { postTitle, postSlug, authorName })
}

async function queueContactFormEmail({ name, email, message }) {
  return emailQueue.add('contact-form', { name, email, message })
}

async function queueCacheInvalidation({ pattern }) {
  return backgroundQueue.add('cache-invalidation', { pattern })
}

module.exports = {
  emailQueue,
  backgroundQueue,
  queueNewPostEmail,
  queueContactFormEmail,
  queueCacheInvalidation,
}