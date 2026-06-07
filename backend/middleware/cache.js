// middleware/cache.js
// Redis cache middleware for Express
// Usage: router.get('/api/posts', cache(60), handler)
'use strict'

const { cacheClient } = require('../redis')

/**
 * cache(ttlSeconds)
 * Caches the JSON response for a route in Redis.
 * Cache key = full request URL (including query params).
 * TTL defaults to 60 seconds.
 */
function cache(ttl = 60) {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`

    try {
      const cached = await cacheClient.get(key)
      if (cached) {
        console.log(`⚡ Cache hit: ${key}`)
        return res.status(200).json(JSON.parse(cached))
      }
    } catch (err) {
      // Cache failure should never block the request
      console.error('Cache read error:', err.message)
      return next()
    }

    // Intercept res.json to store response in cache
    const originalJson = res.json.bind(res)
    res.json = async (body) => {
      try {
        if (res.statusCode === 200) {
          await cacheClient.setex(key, ttl, JSON.stringify(body))
          console.log(`💾 Cached: ${key} (TTL: ${ttl}s)`)
        }
      } catch (err) {
        console.error('Cache write error:', err.message)
      }
      return originalJson(body)
    }

    next()
  }
}

/**
 * invalidateCache(pattern)
 * Immediately deletes all Redis keys matching a pattern.
 * Call this after write operations.
 * Pattern examples:
 *   invalidateCache('cache:/api/posts*')
 *   invalidateCache('cache:/api/tags*')
 */
async function invalidateCache(pattern) {
  try {
    const keys = await cacheClient.keys(pattern)
    if (keys.length > 0) {
      await cacheClient.del(...keys)
      console.log(`🗑️  Invalidated ${keys.length} cache keys: ${pattern}`)
    }
  } catch (err) {
    console.error('Cache invalidation error:', err.message)
  }
}

module.exports = { cache, invalidateCache }