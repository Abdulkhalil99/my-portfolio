import { Router } from 'express'
import {
  sendContactMessage,
  getContactMessages,
  markAsRead,
} from '../controllers/contact.controller'
import { strictLimiter }       from '../middleware/security/rateLimit'
import { validateContactBody } from '../middleware/security/validate'

const router = Router()

// POST /api/contact — send message (public)
router.post(
  '/',
  strictLimiter,
  validateContactBody,
  sendContactMessage,
)

// GET /api/contact — read messages (private — add auth later)
router.get('/', getContactMessages)

// PATCH /api/contact/:id/read — mark as read
router.patch('/:id/read', markAsRead)

export default router
