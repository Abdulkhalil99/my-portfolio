import rateLimit from 'express-rate-limit'
import { ApiResponse } from '../../types'

/*
  WHY different limiters for different routes?
  
  Not all routes have the same risk level:
  
  GET /api/projects   → low risk, read-only, allow more requests
  POST /api/contact   → HIGH risk, spammers love this, allow very few
  GET /health         → monitoring tools need this, allow unlimited
  
  One limiter for all routes is too strict for some
  and too loose for others.
  
  We create SPECIFIC limiters for specific needs.
*/

// ========================
// GENERAL API LIMITER
// For most API routes
// ========================
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minute window
  max:      100,               // 100 requests per window per IP
  message: {
    success: false,
    error:   'Too many requests. Please wait 15 minutes and try again.',
  } as ApiResponse,

  // Add rate limit info to response headers:
  // X-RateLimit-Limit: 100
  // X-RateLimit-Remaining: 87
  // X-RateLimit-Reset: 1234567890
  standardHeaders: true,
  legacyHeaders:   false,

  // Custom handler when limit is exceeded
  handler: (req, res) => {
    const ip = req.ip || 'unknown'
    console.warn(`⚠️  Rate limit exceeded for IP: ${ip} on ${req.path}`)

    res.status(429).json({
      success: false,
      error:  'Too many requests',
      message: `IP ${ip} has exceeded the rate limit. Try again after 15 minutes.`,
    } as ApiResponse)
  },
})

// ========================
// STRICT LIMITER
// For sensitive routes like contact form
// 10 requests per hour per IP
// ========================
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour window
  max:      10,               // only 10 requests per hour
  message: {
    success: false,
    error:   'Too many submissions. Please wait an hour.',
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders:   false,

  handler: (req, res) => {
    const ip = req.ip || 'unknown'
    console.warn(`🚨 Strict rate limit exceeded for IP: ${ip} on ${req.path}`)

    res.status(429).json({
      success: false,
      error:   'Too many submissions',
      message: 'You have submitted too many times. Please wait 1 hour.',
    } as ApiResponse)
  },
})

// ========================
// READ LIMITER
// For GET endpoints — more relaxed
// 300 requests per 15 minutes
// ========================
export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      300,
  message: {
    success: false,
    error:   'Too many requests. Please slow down.',
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders:   false,
})
