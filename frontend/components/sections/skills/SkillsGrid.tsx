'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const skillCategories = [
  {
    title: 'Frontend',
    color: 'violet' as const,
    emoji: '🎨',
    skills: [
      { name: 'Next.js',        level: 90, desc: 'App Router, SSR, ISR' },
      { name: 'React',          level: 90, desc: 'Hooks, Context, Patterns' },
      { name: 'TypeScript',     level: 85, desc: 'Types, Generics, Utility Types' },
      { name: 'Tailwind CSS',   level: 90, desc: 'Utility-first, Responsive' },
      { name: 'Framer Motion',  level: 75, desc: 'Animations, Gestures' },
    ],
  },
  {
    title: 'Backend',
    color: 'blue' as const,
    emoji: '⚙️',
    skills: [
      { name: 'Node.js',    level: 80, desc: 'Event loop, Streams, APIs' },
      { name: 'Express.js', level: 80, desc: 'REST APIs, Middleware' },
      { name: 'Prisma',     level: 75, desc: 'ORM, Migrations, Relations' },
      { name: 'Socket.io',  level: 70, desc: 'Real-time, Rooms, Events' },
      { name: 'REST API',   level: 85, desc: 'Design, Auth, Versioning' },
    ],
  },
  {
    title: 'Database',
    color: 'cyan' as const,
    emoji: '🗄️',
    skills: [
      { name: 'PostgreSQL', level: 75, desc: 'Queries, Indexes, Relations' },
      { name: 'Redis',      level: 65, desc: 'Caching, Sessions, Pub/Sub' },
      { name: 'Supabase',   level: 75, desc: 'Auth, Storage, Realtime' },
      { name: 'SQL',        level: 80, desc: 'Joins, Aggregations, CTEs' },
    ],
  },
]

export function SkillsGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section>
      <div ref={ref}>
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {skillCategories.map((category) => (
            <motion.div key={category.title} variants={fadeInUp}>
              <Card variant={
                category.color === 'violet' ? 'violet'
                : category.color === 'blue' ? 'blue'
                : 'glass'
              } className="h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{category.emoji}</span>
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>

                {/* Skills */}
                <div className="space-y-5">
                  {category.skills.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-baseline mb-1">
                        <div>
                          <span className="text-sm font-medium">{skill.name}</span>
                          <span className="text-xs text-[hsl(var(--text-muted))] ml-2">
                            {skill.desc}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-[hsl(var(--text-muted))]">
                          {skill.level}%
                        </span>
                      </div>

                      {/* Track */}
                      <div className="h-1.5 rounded-full bg-[hsl(var(--bg-base)/0.6)]">
                        <motion.div
                          className={cn(
                            'h-full rounded-full',
                            category.color === 'violet' && 'bg-gradient-to-r from-[hsl(var(--violet))] to-[hsl(var(--blue))]',
                            category.color === 'blue'   && 'bg-gradient-to-r from-[hsl(var(--blue))]   to-[hsl(var(--cyan))]',
                            category.color === 'cyan'   && 'bg-gradient-to-r from-[hsl(var(--cyan))]   to-[hsl(var(--emerald))]',
                          )}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{
                            duration: 1,
                            delay: 0.3 + index * 0.1,
                            ease: 'easeOut' as const,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
