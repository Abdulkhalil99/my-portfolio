'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, Heart, Shield, Lightbulb } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const values = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Performance First',
    description: 'I care about speed. Fast websites make users happy and Google happy.',
    color: 'violet' as const,
  },
  {
    icon: <Heart className="h-5 w-5" />,
    title: 'User Focused',
    description: 'I always think about the person using the product. Good UX is not optional.',
    color: 'rose' as const,
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Clean Code',
    description: 'Code I write today should be easy to read 6 months later. By me or anyone.',
    color: 'emerald' as const,
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: 'Always Learning',
    description: 'The web changes fast. I read, build side projects, and stay curious.',
    color: 'amber' as const,
  },
]

export function Values() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section eyebrow="What I Believe" title="My Values" variant="elevated" centered>
      <div ref={ref}>
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((value) => (
            <motion.div key={value.title} variants={fadeInUp}>
              <Card variant="default" hover glow className="text-center h-full">
                <div className={cn(
                  'mx-auto mb-4 h-12 w-12 rounded-xl',
                  'flex items-center justify-center',
                  value.color === 'violet'  && 'bg-[hsl(var(--violet)/0.1)]  text-[hsl(var(--violet))]  border border-[hsl(var(--violet)/0.2)]',
                  value.color === 'rose'    && 'bg-[hsl(var(--rose)/0.1)]    text-[hsl(var(--rose))]    border border-[hsl(var(--rose)/0.2)]',
                  value.color === 'emerald' && 'bg-[hsl(var(--emerald)/0.1)] text-[hsl(var(--emerald))] border border-[hsl(var(--emerald)/0.2)]',
                  value.color === 'amber'   && 'bg-[hsl(var(--amber)/0.1)]   text-[hsl(var(--amber))]   border border-[hsl(var(--amber)/0.2)]',
                )}>
                  {value.icon}
                </div>
                <h4 className="text-sm font-semibold mb-2">{value.title}</h4>
                <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed">
                  {value.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
