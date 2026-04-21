'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const story = [
  {
    emoji: '👶',
    period: 'The Beginning',
    text: 'I wrote my first line of HTML when I was young. I changed a color and thought I was a wizard. That feeling never went away.',
    color: 'violet' as const,
  },
  {
    emoji: '📚',
    period: 'Learning Phase',
    text: 'I taught myself JavaScript, then React, then Node.js. Hundreds of tutorials, projects, and broken things later — I started to understand how the web really works.',
    color: 'blue' as const,
  },
  {
    emoji: '🚀',
    period: 'First Real Projects',
    text: 'I built my first full-stack app. Real users, real database, real problems to solve. Nothing teaches you faster than shipping something real.',
    color: 'cyan' as const,
  },
  {
    emoji: '🎯',
    period: 'Today',
    text: 'Now I build products I am proud of. I care about performance, clean code, and great user experience. I am always learning something new.',
    color: 'emerald' as const,
  },
]

export function MyStory() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section eyebrow="My Journey" title="My Story" variant="elevated">
      <div ref={ref}>
        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {story.map((chapter, index) => (
            <motion.div key={chapter.period} variants={fadeInUp}>
              <Card variant="glass" hover className="h-full relative overflow-hidden">
                {/* Step number — decorative background */}
                <div className={cn(
                  'absolute top-3 right-3',
                  'font-mono text-4xl font-bold select-none',
                  'text-[hsl(var(--text-primary)/0.04)]',
                )}>
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="text-4xl mb-4">{chapter.emoji}</div>

                <div className={cn(
                  'text-xs font-semibold uppercase tracking-widest mb-2',
                  chapter.color === 'violet'  && 'text-[hsl(var(--violet))]',
                  chapter.color === 'blue'    && 'text-[hsl(var(--blue))]',
                  chapter.color === 'cyan'    && 'text-[hsl(var(--cyan))]',
                  chapter.color === 'emerald' && 'text-[hsl(var(--emerald))]',
                )}>
                  {chapter.period}
                </div>

                <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed">
                  {chapter.text}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
