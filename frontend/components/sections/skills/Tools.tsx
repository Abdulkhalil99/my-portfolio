'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { staggerContainer, fadeInUp } from '@/lib/animations'

const tools = [
  { name: 'VS Code',    emoji: '💻', desc: 'Editor' },
  { name: 'Git',        emoji: '🔀', desc: 'Version Control' },
  { name: 'Docker',     emoji: '🐳', desc: 'Containers' },
  { name: 'Figma',      emoji: '🎨', desc: 'Design' },
  { name: 'Postman',    emoji: '📮', desc: 'API Testing' },
  { name: 'Vercel',     emoji: '▲',  desc: 'Deployment' },
  { name: 'GitHub',     emoji: '🐙', desc: 'Code Hosting' },
  { name: 'Linux',      emoji: '🐧', desc: 'OS' },
]

export function Tools() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section eyebrow="Daily Drivers" title="Tools I Use" variant="elevated" centered>
      <div ref={ref}>
        <motion.div
          variants={staggerContainer(0.07)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {tools.map((tool) => (
            <motion.div key={tool.name} variants={fadeInUp}>
              <Card
                variant="glass"
                padding="sm"
                hover
                className="text-center cursor-default"
              >
                <div className="text-3xl mb-2">{tool.emoji}</div>
                <p className="text-xs font-semibold">{tool.name}</p>
                <p className="text-[10px] text-[hsl(var(--text-muted))] mt-0.5">{tool.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}
