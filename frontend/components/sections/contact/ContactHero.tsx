'use client'

import { motion } from 'framer-motion'
import { Section } from '@/components/ui/Section'
import { staggerContainer, fadeInUp } from '@/lib/animations'

export function ContactHero() {
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
            Say Hello
          </span>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="mb-4">
          Let us{' '}
          <span className="text-gradient">work together</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg text-[hsl(var(--text-secondary))] leading-relaxed"
        >
          Have a project in mind? Want to hire me? Or just want to say hi?
          I read every message and reply within 24 hours.
        </motion.p>
      </motion.div>
    </Section>
  )
}
