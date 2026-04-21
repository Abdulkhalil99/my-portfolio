import express     from 'express'
import { createServer } from 'http'
import dotenv      from 'dotenv'
import { corsMiddleware }        from './middleware/security/cors'
import { helmetMiddleware }      from './middleware/security/helmet'
import { apiLimiter }            from './middleware/security/rateLimit'
import { logger }                from './middleware/logger'
import { errorHandler }          from './middleware/errorHandler'
import { notFound }              from './middleware/notFound'
import { verifyEmailConnection } from './services/email.service'
import { verifyAIConnection }    from './services/ai.service'
import { initSocket }            from './services/socket.service'
import apiRoutes                 from './routes'
import { ApiResponse }           from './types'

dotenv.config()

const app      = express()
const PORT     = process.env.PORT     || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

/*
  WHY createServer(app)?

  Normally Express listens directly:
    app.listen(PORT)

  But Socket.io needs access to the raw Node.js
  HTTP server — not the Express app.

  So we:
  1. Create a raw HTTP server
  2. Give Express to it (handles HTTP requests)
  3. Give Socket.io to it (handles WebSocket)
  Both share the same port!

  Port 5000:
    HTTP request → Express handles it
    WebSocket    → Socket.io handles it
*/
const httpServer = createServer(app)

// Initialize Socket.io on the HTTP server
const io = initSocket(httpServer)

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(helmetMiddleware)
app.use(corsMiddleware)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(logger)
app.use('/api', apiLimiter)

// ============================================================
// ROUTES
// ============================================================
app.get('/health', (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: 'Server is healthy',
    data: {
      status:      'healthy',
      environment: NODE_ENV,
      timestamp:   new Date().toISOString(),
      uptime:      `${Math.floor(process.uptime())}s`,
      connections: io.engine.clientsCount,
      // ↑ how many WebSocket clients are connected right now
    },
  }
  res.status(200).json(response)
})

app.use('/api', apiRoutes)

// ============================================================
// ERROR HANDLERS
// ============================================================
app.use(notFound)
app.use(errorHandler)

// ============================================================
// START — use httpServer.listen NOT app.listen
// ============================================================
httpServer.listen(PORT, async () => {
  console.log('\n' + '═'.repeat(50))
  console.log('🚀  Server running!')
  console.log('═'.repeat(50))
  console.log(`📍  Local:    http://localhost:${PORT}`)
  console.log(`🏥  Health:   http://localhost:${PORT}/health`)
  console.log(`📦  API:      http://localhost:${PORT}/api`)
  console.log(`🔌  Socket:   ws://localhost:${PORT}`)
  console.log(`🌍  Env:      ${NODE_ENV}`)
  console.log('═'.repeat(50))
  console.log('\n🔌 Checking services...')

  await verifyEmailConnection()
  await verifyAIConnection()
  console.log()
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...')
  httpServer.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

export { io }
export default app
