import { create } from 'zustand'

/*
  This store holds real-time data from Socket.io.

  Why Zustand for this?
  Socket.io callbacks are outside React.
  Zustand lets us update state from anywhere.

  Socket callback fires → updates Zustand store →
  React re-renders with new data.
*/

export interface ActivityItem {
  id:        string
  text:      string
  timestamp: string
  type:      'join' | 'leave' | 'page' | 'message'
}

interface LiveState {
  visitorCount: number
  activities:   ActivityItem[]
  isConnected:  boolean

  setVisitorCount: (count: number)          => void
  addActivity:     (item: ActivityItem)     => void
  setActivities:   (items: ActivityItem[])  => void
  setConnected:    (connected: boolean)     => void
}

export const useLiveStore = create<LiveState>((set) => ({
  visitorCount: 0,
  activities:   [],
  isConnected:  false,

  setVisitorCount: (count) => set({ visitorCount: count }),

  addActivity: (item) =>
    set((state) => ({
      // Add to front, keep max 10
      activities: [item, ...state.activities].slice(0, 10),
    })),

  setActivities: (items) => set({ activities: items }),

  setConnected: (connected) => set({ isConnected: connected }),
}))
