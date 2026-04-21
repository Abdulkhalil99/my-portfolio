import { create } from 'zustand'

// What one notification looks like
export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number   // how long to show (milliseconds)
}

interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (notification) => {
    // Create a unique ID using timestamp + random number
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`

    // Add to the list
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }))

    // Auto-remove after duration (default 4 seconds)
    const duration = notification.duration ?? 4000
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      }, duration)
    }
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}))

// ========================
// HELPER FUNCTIONS
// Makes it easier to call from anywhere
// ========================

// Usage: toast.success('Done!', 'Your message was sent')
export const toast = {
  success: (title: string, message?: string) =>
    useNotificationStore.getState().addNotification({ type: 'success', title, message }),

  error: (title: string, message?: string) =>
    useNotificationStore.getState().addNotification({ type: 'error', title, message }),

  info: (title: string, message?: string) =>
    useNotificationStore.getState().addNotification({ type: 'info', title, message }),

  warning: (title: string, message?: string) =>
    useNotificationStore.getState().addNotification({ type: 'warning', title, message }),
}
