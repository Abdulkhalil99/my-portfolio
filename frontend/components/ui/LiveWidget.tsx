'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Activity, ChevronUp, ChevronDown, Wifi, WifiOff } from 'lucide-react'
import { useLiveStore } from '@/store/useLiveStore'
import type { ActivityItem } from '@/store/useLiveStore'
import { cn } from '@/lib/utils'

/*
  Activity icons and colors based on event type
*/
const ACTIVITY_CONFIG = {
  join: {
    emoji: '🟢',
    color: 'text-[hsl(var(--emerald))]',
  },
  leave: {
    emoji: '🔴',
    color: 'text-[hsl(var(--rose))]',
  },
  page: {
    emoji: '👀',
    color: 'text-[hsl(var(--blue))]',
  },
  message: {
    emoji: '💬',
    color: 'text-[hsl(var(--violet))]',
  },
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const secs = Math.floor(diff / 1000)

  if (secs < 5)  return 'just now'
  if (secs < 60) return `${secs}s ago`

  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`

  return 'a while ago'
}

export function LiveWidget() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { visitorCount, activities, isConnected } = useLiveStore()

  return (
    <div className={cn(
      'fixed bottom-20 left-4 sm:left-6 z-40',
      'w-[220px]',
    )}>
      <AnimatePresence>

        {/* EXPANDED PANEL — activity feed */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'mb-2 rounded-xl overflow-hidden',
              'glass-violet',
              'border border-[hsl(var(--violet)/0.2)]',
              'shadow-lg shadow-black/30',
            )}
          >
            {/* Panel header */}
            <div className={cn(
              'px-3 py-2',
              'border-b border-[hsl(var(--violet)/0.15)]',
              'bg-[hsl(var(--violet)/0.06)]',
            )}>
              <div className="flex items-center gap-1.5">
                <Activity className="h-3 w-3 text-[hsl(var(--violet))]" />
                <span className="text-xs font-semibold">Live Activity</span>
              </div>
            </div>

            {/* Activity list */}
            <div className="p-2 space-y-1 max-h-[200px] overflow-y-auto no-scrollbar">
              {activities.length === 0 ? (
                <p className="text-[10px] text-[hsl(var(--text-muted))] text-center py-3">
                  No activity yet...
                </p>
              ) : (
                activities.map((item) => (
                  <ActivityRow key={item.id} item={item} />
                ))
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* COLLAPSED BAR — always visible */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0   }}
        transition={{ delay: 1.5 }}
        onClick={() => setIsExpanded(p => !p)}
        className={cn(
          'w-full flex items-center justify-between',
          'px-3 py-2 rounded-xl',
          'glass border border-[hsl(var(--border-default))]',
          'hover:border-[hsl(var(--violet)/0.3)]',
          'transition-all duration-200',
          'shadow-md shadow-black/20',
          isConnected && 'border-[hsl(var(--violet)/0.2)]',
        )}
      >
        {/* Left — connection + count */}
        <div className="flex items-center gap-2">
          {/* Connection dot */}
          <span className={cn(
            'h-2 w-2 rounded-full shrink-0',
            isConnected
              ? 'bg-[hsl(var(--emerald))] animate-pulse'
              : 'bg-[hsl(var(--text-muted))]',
          )} />

          {/* Visitor count */}
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-[hsl(var(--text-muted))]" />
            <motion.span
              key={visitorCount}
              initial={{ scale: 1.3, color: 'hsl(var(--violet))' }}
              animate={{ scale: 1,   color: 'hsl(var(--text-primary))' }}
              className="text-xs font-semibold tabular-nums"
            >
              {visitorCount}
            </motion.span>
            <span className="text-[10px] text-[hsl(var(--text-muted))]">
              online
            </span>
          </div>
        </div>

        {/* Right — expand/collapse */}
        <div className="flex items-center gap-1.5">
          {isConnected
            ? <Wifi    className="h-3 w-3 text-[hsl(var(--emerald))]" />
            : <WifiOff className="h-3 w-3 text-[hsl(var(--text-muted))]" />
          }
          {isExpanded
            ? <ChevronDown className="h-3 w-3 text-[hsl(var(--text-muted))]" />
            : <ChevronUp   className="h-3 w-3 text-[hsl(var(--text-muted))]" />
          }
        </div>
      </motion.button>

    </div>
  )
}

// Single activity row
function ActivityRow({ item }: { item: ActivityItem }) {
  const config = ACTIVITY_CONFIG[item.type]

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0   }}
      className="flex items-start gap-2 px-1 py-1"
    >
      <span className="text-xs shrink-0 mt-px">{config.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[hsl(var(--text-secondary))] leading-tight">
          {item.text}
        </p>
        <p className="text-[10px] text-[hsl(var(--text-muted))] mt-0.5">
          {timeAgo(item.timestamp)}
        </p>
      </div>
    </motion.div>
  )
}
