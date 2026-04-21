'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useUIStore } from '@/store'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'relative flex items-center',
        'h-8 w-14 rounded-full',
        'border border-[hsl(var(--border-default))]',
        'bg-[hsl(var(--bg-overlay))]',
        'transition-colors duration-300',
        'hover:border-[hsl(var(--violet)/0.4)]',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[hsl(var(--violet))]',
      )}
    >
      {/* The sliding circle */}
      <motion.div
        animate={{
          x: isDark ? 4 : 28,  // slide left (dark) or right (light)
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(
          'absolute h-6 w-6 rounded-full',
          'flex items-center justify-center',
          isDark
            ? 'bg-[hsl(var(--violet))] shadow-[0_0_8px_hsl(var(--violet)/0.6)]'
            : 'bg-[hsl(var(--amber))]  shadow-[0_0_8px_hsl(var(--amber)/0.6)]',
        )}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{    rotate:  90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Moon className="h-3 w-3 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0,  opacity: 1 }}
              exit={{    rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Sun className="h-3 w-3 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  )
}
