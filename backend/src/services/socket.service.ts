import { Server as HttpServer } from 'http'
import { Server as SocketServer, Socket } from 'socket.io'

/*
  We export the io instance so other parts
  of the app can emit events.

  Example:
    import { io } from './socket.service'
    io.emit('new-message', { text: 'hello' })
*/
export let io: SocketServer

// Track connected visitors
let visitorCount = 0

// Recent activity feed (last 10 items)
const activityFeed: ActivityItem[] = []

interface ActivityItem {
  id:        string
  text:      string
  timestamp: string
  type:      'join' | 'leave' | 'page' | 'message'
}

function addActivity(item: Omit<ActivityItem, 'id' | 'timestamp'>) {
  const activity: ActivityItem = {
    ...item,
    id:        `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  }

  // Add to front of array
  activityFeed.unshift(activity)

  // Keep only last 10
  if (activityFeed.length > 10) activityFeed.pop()

  return activity
}

export function initSocket(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    /*
      CORS for Socket.io — separate from Express CORS!
      Socket.io has its own CORS configuration.
    */
    cors: {
      origin:      process.env.FRONTEND_URL || 'http://localhost:3000',
      methods:     ['GET', 'POST'],
      credentials: true,
    },

    /*
      transports = how to connect
      
      websocket  = real WebSocket (fast, modern)
      polling    = HTTP fallback (slower, for old browsers)
      
      We prefer WebSocket but allow polling as fallback.
    */
    transports: ['websocket', 'polling'],

    // Ping settings — detect dead connections
    pingTimeout:  60000,  // 60 seconds
    pingInterval: 25000,  // check every 25 seconds
  })

  // ========================
  // CONNECTION EVENT
  // Runs every time a new client connects
  // ========================
  io.on('connection', (socket: Socket) => {
    // Increase visitor count
    visitorCount++

    console.log(`🟢 Client connected: ${socket.id} (total: ${visitorCount})`)

    // Add join activity
    const joinActivity = addActivity({
      type: 'join',
      text: 'A new visitor joined',
    })

    /*
      Tell ALL connected clients the new count.
      io.emit = sends to EVERYONE including the new person.
      socket.broadcast.emit = sends to everyone EXCEPT new person.
    */
    io.emit('visitor-count', { count: visitorCount })
    io.emit('new-activity',  joinActivity)

    // Send current state to the NEW client only
    socket.emit('activity-history', activityFeed)

    // ========================
    // PAGE VIEW EVENT
    // Client tells us which page they are on
    // ========================
    socket.on('page-view', (data: { page: string }) => {
      const pageNames: Record<string, string> = {
        '/':         'Home',
        '/about':    'About',
        '/projects': 'Projects',
        '/skills':   'Skills',
        '/blog':     'Blog',
        '/contact':  'Contact',
      }

      const pageName = pageNames[data.page] || data.page

      const activity = addActivity({
        type: 'page',
        text: `Someone is viewing ${pageName}`,
      })

      // Tell everyone about this page view
      io.emit('new-activity', activity)
    })

    // ========================
    // MESSAGE SENT EVENT
    // Triggered when someone sends contact form
    // ========================
    socket.on('contact-sent', () => {
      const activity = addActivity({
        type: 'message',
        text: 'Someone sent a message',
      })

      io.emit('new-activity', activity)
    })

    // ========================
    // DISCONNECT EVENT
    // Runs when a client leaves
    // ========================
    socket.on('disconnect', (reason) => {
      visitorCount = Math.max(0, visitorCount - 1)

      console.log(`🔴 Client disconnected: ${socket.id} (${reason}) (total: ${visitorCount})`)

      const leaveActivity = addActivity({
        type: 'leave',
        text: 'A visitor left',
      })

      io.emit('visitor-count', { count: visitorCount })
      io.emit('new-activity',  leaveActivity)
    })
  })

  console.log('✅ Socket.io initialized')
  return io
}
