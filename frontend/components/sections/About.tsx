'use client'


import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2, Server, Database } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Section } from '@/components/ui/Section'
import { cn } from '@/lib/utils'
import { SKILLS } from '@/lib/constants'
import { staggerContainer, fadeInLeft, fadeInRight } from '@/lib/animations'

const categoryIcons: Record<string, React.ReactNode> = {
  Frontend: <Code2 className="h-4 w-4" />,
  Backend: <Server className="h-4 w-4" />,
  Tools: <Database className="h-4 w-4" />,
}

const categoryColors: Record<string, 'violet' | 'blue' | 'cyan'> = {
  Frontend: 'violet',
  Backend: 'blue',
  Tools: 'cyan',
}

export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const categories = ['Frontend', 'Backend', 'Tools']

  return (
    <Section id="about" eyebrow="About Me" title="Who I Am" variant="elevated">
      <div ref={ref}>
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeInLeft} className="space-y-6">
            <div className="space-y-4">
              <p className="text-base text-[hsl(var(--text-secondary))] leading-relaxed">
                I am a passionate full-stack developer who loves building products that are both{' '}
                <span className="text-[hsl(var(--violet))] font-medium">beautiful</span> and{' '}
                <span className="text-[hsl(var(--blue))] font-medium">technically excellent</span>.
              </p>
              <p className="text-base text-[hsl(var(--text-secondary))] leading-relaxed">
                I specialize in the JavaScript ecosystem from pixel-perfect React UIs
                to scalable Node.js APIs. I care deeply about performance, developer
                experience, and clean code.
              </p>
              <p className="text-base text-[hsl(var(--text-secondary))] leading-relaxed">
                When I am not coding, I write about web development and contribute
                to open source projects.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              {[
                { icon: <Code2 className="h-5 w-5" />, title: 'Frontend', desc: 'Pixel-perfect, fast UIs', color: 'violet' as const },
                { icon: <Server className="h-5 w-5" />, title: 'Backend', desc: 'Scalable APIs and services', color: 'blue' as const },
                { icon: <Database className="h-5 w-5" />, title: 'Database', desc: 'PostgreSQL, Redis, Prisma', color: 'cyan' as const },
              ].map((item) => (
                <Card key={item.title} variant="glass" padding="sm" className="text-center">
                  <div className={cn(
                    'mx-auto mb-2 h-9 w-9 rounded-lg flex items-center justify-center',
                    item.color === 'violet' && 'bg-[hsl(var(--violet)/0.1)] text-[hsl(var(--violet))]',
                    item.color === 'blue' && 'bg-[hsl(var(--blue)/0.1)] text-[hsl(var(--blue))]',
                    item.color === 'cyan' && 'bg-[hsl(var(--cyan)/0.1)] text-[hsl(var(--cyan))]',
                  )}>
                    {item.icon}
                  </div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-[hsl(var(--text-muted))] mt-1">{item.desc}</p>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeInRight} className="space-y-6">
            {categories.map((category) => {
              const categorySkills = SKILLS.filter(s => s.category === category)
              const color = categoryColors[category]
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn(
                      'p-1.5 rounded-md',
                      color === 'violet' && 'bg-[hsl(var(--violet)/0.1)] text-[hsl(var(--violet))]',
                      color === 'blue' && 'bg-[hsl(var(--blue)/0.1)] text-[hsl(var(--blue))]',
                      color === 'cyan' && 'bg-[hsl(var(--cyan)/0.1)] text-[hsl(var(--cyan))]',
                    )}>
                      {categoryIcons[category]}
                    </span>
                    <span className="text-sm font-semibold">{category}</span>
                  </div>
                  <div className="space-y-3">
                    {categorySkills.map((skill, index) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-[hsl(var(--text-secondary))]">{skill.name}</span>
                          <span className="text-xs text-[hsl(var(--text-muted))] font-mono">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[hsl(var(--bg-overlay))]">
                          <motion.div
                            className={cn(
                              'h-full rounded-full',
                              color === 'violet' && 'bg-gradient-to-r from-[hsl(var(--violet))] to-[hsl(var(--blue))]',
                              color === 'blue' && 'bg-gradient-to-r from-[hsl(var(--blue))] to-[hsl(var(--cyan))]',
                              color === 'cyan' && 'bg-gradient-to-r from-[hsl(var(--cyan))] to-[hsl(var(--emerald))]',
                            )}
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                            transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  )
}
