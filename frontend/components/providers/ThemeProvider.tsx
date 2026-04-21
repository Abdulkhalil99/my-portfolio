'use client'

import { useEffect } from 'react'
import { useUIStore } from '@/store'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore()

  useEffect(() => {
    const root = document.documentElement

    // Remove both first, then add the correct one
    root.classList.remove('dark', 'light')
    root.classList.add(theme)

  }, [theme])

  return <>{children}</>
}
