import { Router } from 'express'
import { getAllProjects, getProjectById } from '../controllers/projects.controller'
import { readLimiter } from '../middleware/security/rateLimit'

const router = Router()

// Read routes get more relaxed limiter (300 req / 15 min)
router.get('/',    readLimiter, getAllProjects)
router.get('/:id', readLimiter, getProjectById)

export default router
