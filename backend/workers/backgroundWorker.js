// workers/backgroundWorker.js
// Processes background jobs — cache invalidation etc.
'use strict'

const { Worker } = require('bullmq')
const { bullMQConnection, cacheClient } = require('../redis')

async function startBackgroundWorker() {
  const worker = new Worker(
    'background',
    async (job) => {
      console.log(`⚙️  Processing background job: ${job.name} (id: ${job.id})`)

      switch (job.name) {
        case 'cache-invalidation': {
          const { pattern } = job.data
          const keys = await cacheClient.keys(pattern)
          if (keys.length > 0) {
            await cacheClient.del(...keys)
            console.log(`🗑️  Cache invalidated: ${keys.length} keys matching "${pattern}"`)
          } else {
            console.log(`ℹ️  No cache keys found for pattern "${pattern}"`)
          }
          break
        }
        default:
          console.warn(`Unknown background job type: ${job.name}`)
      }
    },
    {
      connection: bullMQConnection,
      concurrency: 10,
    }
  )

  worker.on('completed', (job) => {
    console.log(`✅ Background job completed: ${job.name} (id: ${job.id})`)
  })

  worker.on('failed', (job, err) => {
    console.error(`❌ Background job failed: ${job?.name} —`, err.message)
  })

  console.log('🔄 Background worker started')
  return worker
}

module.exports = { startBackgroundWorker }