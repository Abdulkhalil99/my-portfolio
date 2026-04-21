'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import { useLiveStore } from '@/store/useLiveStore'
import type { ActivityItem } from '@/store/useLiveStore'

/*
  This provider:
  1. Connects to Socket.io once for the whole app
  2. Listens to ALL socket events
  3. Updates the Zustand store with real-time data
  4. Emits page-view events when user navigates

  It lives in layout.tsx so it runs on every page.
*/

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

let socket: Socket | null = null

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const {
    setVisitorCount,
    addActivity,
    setActivities,
    setConnected,
  } = useLiveStore()

  // ========================
  // CONNECT ONCE
  // ========================
  useEffect(() => {
    socket = io(SOCKET_URL, {
      transports:           ['websocket', 'polling'],
      reconnection:         true,
      reconnectionDelay:    1000,
      reconnectionAttempts: 10,
    })

    // Connection status
    socket.on('connect', () => {
      console.log('🟢 Socket.io connected')
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('🔴 Socket.io disconnected')
      setConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.warn('⚠️  Socket error:', err.message)
      setConnected(false)
    })

    // Real-time events from server
    socket.on('visitor-count', ({ count }: { count: number }) => {
      setVisitorCount(count)
    })

    socket.on('new-activity', (item: ActivityItem) => {
      addActivity(item)
    })

    socket.on('activity-history', (items: ActivityItem[]) => {
      setActivities(items)
    })

    // Cleanup on unmount
    return () => {
      socket?.disconnect()
      socket = null
    }
  }, [addActivity, setActivities, setConnected, setVisitorCount])

  // ========================
  // EMIT PAGE VIEW
  // Every time user navigates to a new page
  // ========================
  useEffect(() => {
    if (socket?.connected) {
      socket.emit('page-view', { page: pathname })
    }
  }, [pathname])

  return <>{children}</>
}
