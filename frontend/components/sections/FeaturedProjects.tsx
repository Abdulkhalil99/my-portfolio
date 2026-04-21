'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ExternalLink, Code } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { FEATURED_PROJECTS } from '@/lib/constants'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export function FeaturedProjects() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section
      id="projects"
      eyebrow="My Work"
      title="Featured Projects"
      subtitle="Things I have built that I am proud of."
      centered
    >
      <div ref={ref}>
        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {FEATURED_PROJECTS.map((project, index) => (
            <motion.div key={project.id} variants={fadeInUp}>
              <Card
                variant="default"
                padding="none"
                hover
                glow
                className="h-full flex flex-col group"
              >
                <div
                  className={[
                    'h-40 rounded-t-[var(--radius-lg)]',
                    'bg-gradient-to-br',
                    project.gradient,
                    'relative overflow-hidden',
                  ].join(' ')}
                >
                  <div className="absolute top-4 right-4 font-mono text-5xl font-bold text-white/5 select-none">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                </div>

                <div className="flex flex-col flex-1 p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[hsl(var(--violet))] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
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
                        className="flex items-center gap-1.5 text-xs text-[hsl(var(--text-muted))] hover:text-[hsl(var(--violet))] transition-colors duration-200"
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
                        className="flex items-center gap-1.5 text-xs text-[hsl(var(--text-muted))] hover:text-[hsl(var(--violet))] transition-colors duration-200"
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
        </motion.div>

        <div className="flex justify-center">
          <Link href="/projects">
            <Button
              variant="secondary"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              View All Projects
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  )
}
