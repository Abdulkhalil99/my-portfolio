'use client'

import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export function ProjectsHero() {
  return (
    <Section className="pt-32 pb-8">
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        animate="show"
        className="max-w-2xl"
      >
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-4">
          <span className="h-px w-6 bg-[hsl(var(--violet))]" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--violet))]">
            My Work
          </span>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="mb-4">
          Things I have{' '}
          <span className="text-gradient">Built</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg text-[hsl(var(--text-secondary))] leading-relaxed"
        >
          A collection of projects I have built — from small experiments
          to full production apps. Each one taught me something new.
        </motion.p>
      </motion.div>
    </Section>
  )
}
