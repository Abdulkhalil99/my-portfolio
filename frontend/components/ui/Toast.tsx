'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useNotificationStore } from '@/store/useNotificationStore'
import type { Notification } from '@/store/useNotificationStore'
import { cn } from '@/lib/utils'

// Icons and colors for each notification type
const TOAST_CONFIG = {
  success: {
    icon: <CheckCircle className="h-4 w-4" />,
    className: 'border-[hsl(var(--emerald)/0.3)] bg-[hsl(var(--emerald)/0.08)]',
    iconClass: 'text-[hsl(var(--emerald))]',
  },
  error: {
    icon: <AlertCircle className="h-4 w-4" />,
    className: 'border-[hsl(var(--rose)/0.3)] bg-[hsl(var(--rose)/0.08)]',
    iconClass: 'text-[hsl(var(--rose))]',
  },
  info: {
    icon: <Info className="h-4 w-4" />,
    className: 'border-[hsl(var(--blue)/0.3)] bg-[hsl(var(--blue)/0.08)]',
    iconClass: 'text-[hsl(var(--blue))]',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    className: 'border-[hsl(var(--amber)/0.3)] bg-[hsl(var(--amber)/0.08)]',
    iconClass: 'text-[hsl(var(--amber))]',
  },
}

// Single toast item
function ToastItem({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotificationStore()
  const config = TOAST_CONFIG[notification.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}   // slides in from right
      animate={{ opacity: 1, x: 0,   scale: 1 }}
      exit={{    opacity: 0, x: 100, scale: 0.9 }}    // slides out to right
      transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
      className={cn(
        'flex items-start gap-3',
        'w-80 p-4 rounded-xl',
        'glass border',
        'shadow-lg shadow-black/20',
        config.className,
      )}
    >
      {/* Icon */}
      <span className={cn('mt-0.5 shrink-0', config.iconClass)}>
        {config.icon}
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[hsl(var(--text-primary))]">
          {notification.title}
        </p>
        {notification.message && (
          <p className="text-xs text-[hsl(var(--text-secondary))] mt-0.5 leading-relaxed">
            {notification.message}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => removeNotification(notification.id)}
        className={cn(
          'shrink-0 mt-0.5',
          'text-[hsl(var(--text-muted))]',
          'hover:text-[hsl(var(--text-primary))]',
          'transition-colors duration-150',
        )}
        aria-label="Close notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  )
}

// Container that holds ALL toasts
// This goes in layout.tsx so it is always visible
export function ToastContainer() {
  const { notifications } = useNotificationStore()

  return (
    /*
      fixed = stays in corner even when scrolling
      z-[100] = appears above everything (even modals)
      pointer-events-none = clicks pass through empty space
      pointer-events-auto on each toast = clicks work on toasts
    */
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <ToastItem notification={notification} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
