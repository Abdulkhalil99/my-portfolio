'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SITE_CONFIG } from '@/lib/constants'
import { fadeInUp, staggerContainer } from '@/lib/animations'

export function CTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="section-padding">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
        >
          <motion.div
            variants={fadeInUp}
            className="relative rounded-[var(--radius-xl)] overflow-hidden glass-violet p-12 text-center"
          >
            <div
              aria-hidden="true"
              className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-[hsl(var(--violet)/0.8)] to-transparent"
            />

            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[hsl(var(--violet))] mb-4">
                <span className="h-px w-6 bg-[hsl(var(--violet))]" />
                Open to Opportunities
                <span className="h-px w-6 bg-[hsl(var(--violet))]" />
              </span>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="mb-4">
              Let us Build Something{' '}
              <span className="text-gradient">Amazing</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-[hsl(var(--text-secondary))] max-w-xl mx-auto mb-8 text-balance"
            >
              I am currently available for freelance work, full-time positions,
              or interesting collaborations. Let us talk!
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/contact">
                <Button variant="primary" size="lg" leftIcon={<Mail className="h-5 w-5" />}>
                  Get In Touch
                </Button>
              </Link>
              <a href={SITE_CONFIG.github} target="_blank" rel="noopener noreferrer">
                <Button variant="glass" size="lg">
                  View GitHub
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
