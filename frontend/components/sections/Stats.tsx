'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { STATS } from '@/lib/constants'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative py-16 overflow-hidden">
      <div className={cn(
        'absolute top-0 left-0 right-0 h-px',
        'bg-gradient-to-r from-transparent via-[hsl(var(--border-strong))] to-transparent',
      )} />
      <div className={cn(
        'absolute bottom-0 left-0 right-0 h-px',
        'bg-gradient-to-r from-transparent via-[hsl(var(--border-strong))] to-transparent',
      )} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="flex flex-col items-center text-center gap-1"
            >
              <span className="text-4xl sm:text-5xl font-bold text-gradient">
                {stat.value}
              </span>
              <span className="text-sm text-[hsl(var(--text-muted))]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}