import { Router }   from 'express'
import projectsRoute from './projects.route'
import blogRoute     from './blog.route'
import contactRoute  from './contact.route'
import aiRoute       from './ai.route'

const router = Router()

router.use('/projects', projectsRoute)
router.use('/blog',     blogRoute)
router.use('/contact',  contactRoute)
router.use('/ai',       aiRoute)

export default router
