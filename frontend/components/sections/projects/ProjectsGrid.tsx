'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ExternalLink, Code } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const ALL_PROJECTS = [
  {
    id: '1',
    title: 'Portfolio Website',
    description: 'This portfolio! Built with Next.js 14, Three.js, and Framer Motion.',
    techStack: ['Next.js', 'TypeScript', 'Three.js', 'Framer Motion'],
    category: 'Frontend',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    gradient: 'from-violet-500/20 to-blue-500/20',
    featured: true,
  },
  {
    id: '2',
    title: 'Real-time Dashboard',
    description: 'Live analytics dashboard with Socket.io and Redis for instant updates.',
    techStack: ['React', 'Socket.io', 'Redis', 'Node.js'],
    category: 'Full-Stack',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    featured: true,
  },
  {
    id: '3',
    title: 'AI Writing Tool',
    description: 'SaaS app that uses Gemini API to help users write better content.',
    techStack: ['Next.js', 'Gemini API', 'Supabase', 'Stripe'],
    category: 'Full-Stack',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    gradient: 'from-cyan-500/20 to-emerald-500/20',
    featured: true,
  },
  {
    id: '4',
    title: 'E-commerce API',
    description: 'REST API for an e-commerce platform. Orders, payments, inventory.',
    techStack: ['Node.js', 'Express', 'PostgreSQL', 'Prisma'],
    category: 'Backend',
    githubUrl: 'https://github.com',
    liveUrl: '',
    gradient: 'from-emerald-500/20 to-amber-500/20',
    featured: false,
  },
  {
    id: '5',
    title: 'Weather App',
    description: 'Clean weather app with location detection and 7-day forecast.',
    techStack: ['React', 'TypeScript', 'Tailwind'],
    category: 'Frontend',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    gradient: 'from-amber-500/20 to-rose-500/20',
    featured: false,
  },
  {
    id: '6',
    title: 'Blog Platform',
    description: 'Full-stack blog with markdown support, tags, and comments.',
    techStack: ['Next.js', 'PostgreSQL', 'Prisma', 'MDX'],
    category: 'Full-Stack',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    gradient: 'from-rose-500/20 to-violet-500/20',
    featured: false,
  },
]

const CATEGORIES = ['All', 'Full-Stack', 'Frontend', 'Backend']

export function ProjectsGrid() {
  const [activeCategory, setActiveCategory] = useState('All')
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const filtered = activeCategory === 'All'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter(p => p.category === activeCategory)

  return (
    <Section>
      <div ref={ref}>
        {/* Filter buttons */}
        <motion.div
          variants={staggerContainer(0.05)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              variants={fadeInUp}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium',
                'transition-all duration-200',
                activeCategory === cat
                  ? 'bg-[hsl(var(--violet))] text-white shadow-[0_0_20px_hsl(var(--violet)/0.4)]'
                  : 'glass border border-[hsl(var(--border-default))] text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]',
              )}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  variant="default"
                  padding="none"
                  hover
                  glow
                  className="h-full flex flex-col group"
                >
                  {/* Gradient header */}
                  <div className={cn(
                    'h-36 rounded-t-[var(--radius-lg)]',
                    'bg-gradient-to-br relative overflow-hidden',
                    project.gradient,
                  )}>
                    {project.featured && (
                      <div className={cn(
                        'absolute top-3 left-3',
                        'px-2 py-0.5 rounded-full',
                        'bg-[hsl(var(--violet)/0.8)] backdrop-blur-sm',
                        'text-[10px] font-semibold text-white',
                      )}>
                        Featured
                      </div>
                    )}
                    <div className="absolute top-3 right-3 font-mono text-4xl font-bold text-white/5 select-none">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base font-semibold group-hover:text-[hsl(var(--violet))] transition-colors">
                        {project.title}
                      </h3>
                      <span className={cn(
                        'text-[10px] font-mono px-2 py-0.5 rounded',
                        'bg-[hsl(var(--bg-overlay))] text-[hsl(var(--text-muted))]',
                        'shrink-0',
                      )}>
                        {project.category}
                      </span>
                    </div>

                    <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed mb-4 flex-1">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map((tech) => (
                        <Badge key={tech} variant="default">{tech}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-[hsl(var(--text-muted))] hover:text-[hsl(var(--violet))] transition-colors"
                        >
                          <Code className="h-3.5 w-3.5" />
                          Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-[hsl(var(--text-muted))] hover:text-[hsl(var(--violet))] transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  )
}
