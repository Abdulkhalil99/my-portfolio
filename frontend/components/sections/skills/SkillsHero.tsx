'use client'

import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export function SkillsHero() {
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
            My Stack
          </span>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="mb-4">
          Skills and{' '}
          <span className="text-gradient">Tools</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg text-[hsl(var(--text-secondary))] leading-relaxed"
        >
          Technologies I work with daily. I prefer depth over breadth —
          I would rather know a few tools very well than many tools poorly.
        </motion.p>
      </motion.div>
    </Section>
  )
}
