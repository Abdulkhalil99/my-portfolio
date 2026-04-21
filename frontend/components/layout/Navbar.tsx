'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/constants'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300',
          isScrolled
            ? 'glass border-b border-[hsl(var(--border-default))] shadow-lg shadow-black/20'
            : 'bg-transparent',
        )}
      >
        <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg',
                'bg-[hsl(var(--violet)/0.1)] border border-[hsl(var(--violet)/0.3)]',
                'transition-all duration-300',
                'group-hover:bg-[hsl(var(--violet)/0.2)]',
                'group-hover:shadow-[0_0_15px_hsl(var(--violet)/0.4)]',
              )}>
                <Code2 className="h-4 w-4 text-[hsl(var(--violet))]" />
              </div>
              <span className="font-mono text-sm font-bold">
                <span className="text-[hsl(var(--violet))]">&lt;</span>
                <span className="text-[hsl(var(--text-primary))]">{SITE_CONFIG.name}</span>
                <span className="text-[hsl(var(--violet))]">/&gt;</span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium rounded-lg',
                      'transition-all duration-200',
                      isActive
                        ? 'text-[hsl(var(--violet))]'
                        : 'text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-lg bg-[hsl(var(--violet)/0.1)] border border-[hsl(var(--violet)/0.2)]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                )
              })}

              {/* Theme Toggle */}
              <div className="ml-2">
                <ThemeToggle />
              </div>

              {/* CTA */}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className={cn(
                  'ml-2 px-4 py-2 text-sm font-medium rounded-lg',
                  'bg-[hsl(var(--violet))] text-white',
                  'hover:bg-[hsl(var(--violet-dim))]',
                  'transition-all duration-200',
                  'shadow-[0_0_15px_hsl(var(--violet)/0.3)]',
                  'hover:shadow-[0_0_25px_hsl(var(--violet)/0.5)]',
                )}
              >
                Hire Me
              </a>
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={cn(
                  'flex items-center justify-center',
                  'h-9 w-9 rounded-lg',
                  'bg-[hsl(var(--bg-overlay))] hover:bg-[hsl(var(--muted))]',
                  'transition-colors duration-200',
                )}
                aria-label="Toggle menu"
              >
                {isMenuOpen
                  ? <X    className="h-4 w-4" />
                  : <Menu className="h-4 w-4" />}
              </button>
            </div>

          </div>
        </nav>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed inset-x-0 top-16 z-40 md:hidden',
              'glass border-b border-[hsl(var(--border-default))]',
              'px-4 py-4 space-y-1',
            )}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-lg text-sm font-medium',
                    'transition-colors duration-200',
                    isActive
                      ? 'bg-[hsl(var(--violet)/0.1)] text-[hsl(var(--violet))] border border-[hsl(var(--violet)/0.2)]'
                      : 'text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-overlay))]',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-[hsl(var(--border-default))]">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className={cn(
                  'flex items-center justify-center',
                  'w-full px-4 py-3 rounded-lg',
                  'bg-[hsl(var(--violet))] text-white',
                  'text-sm font-medium',
                  'transition-colors duration-200 hover:bg-[hsl(var(--violet-dim))]',
                )}
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
