// middleware/auth.js
'use strict'

const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET
console.log(JWT_SECRET)

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables')
}

/**
 * requireAuth — protects any route it is applied to.
 * Expects: Authorization: Bearer <token>
 * Attaches decoded payload to req.user
 */
function requireAuth(req, res, next) {
  const header = req.headers['authorization']

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' })
  }

  const token = header.split(' ')[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = { requireAuth }