import morgan from 'morgan'
import { Request, Response } from 'express'

/*
  Morgan is a logging library.
  It automatically logs every request like:
  
  GET /api/projects 200 45ms
  POST /api/contact 201 120ms
  GET /api/blog/my-post 404 12ms
  
  This is very useful for debugging.
  In production we use 'combined' format (more details).
  In development we use 'dev' format (colorful, simple).
*/

// Custom token — adds request body to logs (dev only)
morgan.token('body', (req: Request) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    // Do not log passwords or sensitive data
    const safeBody = { ...req.body }
    if (safeBody.password) safeBody.password = '***'
    return JSON.stringify(safeBody)
  }
  return ''
})

export const logger = morgan(
  process.env.NODE_ENV === 'production'
    ? 'combined'   // detailed logs for production
    : 'dev'        // colorful simple logs for development
)
