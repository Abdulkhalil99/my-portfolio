'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase, GraduationCap } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const experiences = [
  {
    type: 'work' as const,
    title: 'Full-Stack Developer',
    place: 'Freelance',
    period: '2023 — Present',
    description: 'Building web applications for clients. React, Node.js, PostgreSQL.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
  },
  {
    type: 'work' as const,
    title: 'Frontend Developer',
    place: 'Startup Project',
    period: '2022 — 2023',
    description: 'Built the entire frontend of a SaaS product from scratch.',
    tags: ['Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    type: 'education' as const,
    title: 'Software Engineering',
    place: 'University',
    period: '2021 — Present',
    description: 'Studying computer science and software engineering fundamentals.',
    tags: ['Algorithms', 'Data Structures', 'Systems'],
  },
  {
    type: 'education' as const,
    title: 'Self Taught',
    place: 'Online Courses + Projects',
    period: '2019 — 2021',
    description: 'Learned web development through courses, YouTube, and building things.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
]

export function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section eyebrow="Background" title="Experience">
      <div ref={ref}>
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Work column */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-[hsl(var(--violet)/0.1)] border border-[hsl(var(--violet)/0.2)] flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-[hsl(var(--violet))]" />
              </div>
              <h3 className="text-base font-semibold">Work</h3>
            </div>

            <div className="space-y-4">
              {experiences.filter(e => e.type === 'work').map((exp) => (
                <motion.div key={exp.title} variants={fadeInUp}>
                  <TimelineCard exp={exp} accentColor="violet" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education column */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-[hsl(var(--blue)/0.1)] border border-[hsl(var(--blue)/0.2)] flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-[hsl(var(--blue))]" />
              </div>
              <h3 className="text-base font-semibold">Education</h3>
            </div>

            <div className="space-y-4">
              {experiences.filter(e => e.type === 'education').map((exp) => (
                <motion.div key={exp.title} variants={fadeInUp}>
                  <TimelineCard exp={exp} accentColor="blue" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

function TimelineCard({
  exp,
  accentColor,
}: {
  exp: typeof experiences[0]
  accentColor: 'violet' | 'blue'
}) {
  return (
    <div className={cn(
      'relative pl-4',
      'border-l-2',
      accentColor === 'violet' && 'border-[hsl(var(--violet)/0.3)]',
      accentColor === 'blue'   && 'border-[hsl(var(--blue)/0.3)]',
    )}>
      {/* Dot on the timeline */}
      <div className={cn(
        'absolute -left-[5px] top-1.5',
        'h-2 w-2 rounded-full',
        accentColor === 'violet' && 'bg-[hsl(var(--violet))]',
        accentColor === 'blue'   && 'bg-[hsl(var(--blue))]',
      )} />

      <div className="glass rounded-xl p-4 border border-[hsl(var(--border-default))]">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-semibold">{exp.title}</h4>
          <span className="text-[10px] font-mono text-[hsl(var(--text-muted))] shrink-0">
            {exp.period}
          </span>
        </div>

        <p className={cn(
          'text-xs font-medium mb-2',
          accentColor === 'violet' && 'text-[hsl(var(--violet))]',
          accentColor === 'blue'   && 'text-[hsl(var(--blue))]',
        )}>
          {exp.place}
        </p>

        <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed mb-3">
          {exp.description}
        </p>

        <div className="flex flex-wrap gap-1">
          {exp.tags.map((tag) => (
            <Badge key={tag} variant={accentColor === 'violet' ? 'violet' : 'blue'}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
