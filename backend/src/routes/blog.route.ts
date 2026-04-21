import { Router } from 'express'
import { getAllPosts, getPostBySlug } from '../controllers/blog.controller'
import { readLimiter } from '../middleware/security/rateLimit'

const router = Router()

router.get('/',      readLimiter, getAllPosts)
router.get('/:slug', readLimiter, getPostBySlug)

export default router
