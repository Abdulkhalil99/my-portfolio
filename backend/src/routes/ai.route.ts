import { Router }     from 'express'
import { chat, chatStream } from '../controllers/ai.controller'
import { apiLimiter } from '../middleware/security/rateLimit'
import rateLimit      from 'express-rate-limit'

const router = Router()

/*
  Special rate limiter for AI endpoint.
  
  Gemini free tier: 60 requests per minute.
  We limit to 20 per minute per IP to be safe
  and to prevent abuse.
  
  Each "request" = one message sent.
*/
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max:      20,          // 20 messages per minute per IP
  message: {
    success: false,
    error:   'Too many messages. Please wait a minute.',
  },
  standardHeaders: true,
  legacyHeaders:   false,
})

// Normal response
router.post('/chat',        aiLimiter, chat)

// Streaming response
router.post('/chat/stream', aiLimiter, chatStream)

export default router
