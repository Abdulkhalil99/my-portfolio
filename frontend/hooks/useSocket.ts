'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

/*
  This hook:
  1. Connects to the backend Socket.io server
  2. Keeps the connection alive
  3. Returns the socket so components can use it
  4. Cleans up when component unmounts

  WHY a hook and not a global?
  Because we want React to manage the lifecycle.
  When the component using this hook unmounts →
  the connection is cleaned up automatically.
*/

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface UseSocketReturn {
  socket:      Socket | null
  isConnected: boolean
}

export function useSocket(): UseSocketReturn {
  const socketRef              = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Create connection
    const socket = io(SOCKET_URL, {
      transports:       ['websocket', 'polling'],
      reconnection:     true,          // auto-reconnect
      reconnectionDelay:    1000,      // wait 1s before retry
      reconnectionAttempts: 5,         // try 5 times max
    })

    socketRef.current = socket

    // Connection events
    socket.on('connect', () => {
      console.log('🟢 Socket connected:', socket.id)
      setIsConnected(true)
    })

    socket.on('disconnect', (reason) => {
      console.log('🔴 Socket disconnected:', reason)
      setIsConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.warn('⚠️  Socket connection error:', error.message)
      setIsConnected(false)
    })

    // Cleanup when component unmounts
    return () => {
      console.log('🧹 Cleaning up socket')
      socket.disconnect()
    }
  }, [])
  // ↑ Empty array = run once when component mounts

  return {
    socket:      socketRef.current,
    isConnected,
  }
}
