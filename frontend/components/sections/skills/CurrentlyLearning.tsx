'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const learning = [
  {
    name: 'Three.js / R3F',
    desc: 'Building 3D experiences in the browser. WebGL without the pain.',
    progress: 40,
    badge: 'In Progress' as const,
  },
  {
    name: 'Rust',
    desc: 'Systems programming language. Blazing fast, memory safe.',
    progress: 20,
    badge: 'Just Started' as const,
  },
  {
    name: 'DevOps / AWS',
    desc: 'CI/CD pipelines, cloud deployment, infrastructure as code.',
    progress: 35,
    badge: 'In Progress' as const,
  },
]

export function CurrentlyLearning() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section eyebrow="Growth" title="Currently Learning">
      <div ref={ref}>
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {learning.map((item, index) => (
            <motion.div key={item.name} variants={fadeInUp}>
              <Card variant="default" hover className="h-full">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-[hsl(var(--amber)/0.1)] border border-[hsl(var(--amber)/0.2)] flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-[hsl(var(--amber))]" />
                  </div>
                  <Badge variant={item.badge === 'In Progress' ? 'amber' : 'violet'}>
                    {item.badge}
                  </Badge>
                </div>

                <h4 className="font-semibold mb-2">{item.name}</h4>
                <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed mb-4">
                  {item.desc}
                </p>

                {/* Progress */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[hsl(var(--text-muted))]">Progress</span>
                    <span className="text-xs font-mono text-[hsl(var(--amber))]">{item.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[hsl(var(--bg-overlay))]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--amber))] to-[hsl(var(--rose))]"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${item.progress}%` } : { width: 0 }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' as const }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
