'use client'

import { motion } from 'framer-motion'
import { MapPin, Coffee, Code2 } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { cn } from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/constants'
import { staggerContainer, fadeInUp, fadeInLeft, fadeInRight } from '@/lib/animations'

export function AboutHero() {
  return (
    <Section className="pt-32 pb-16">
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        {/* LEFT — Text */}
        <motion.div variants={fadeInLeft} className="space-y-6">
          <div>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-[hsl(var(--violet))]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--violet))]">
                About Me
              </span>
            </motion.div>

            <h1 className="mb-4">
              I turn ideas into{' '}
              <span className="text-gradient">real products</span>
            </h1>

            <p className="text-lg text-[hsl(var(--text-secondary))] leading-relaxed">
              I am a full-stack developer based in {SITE_CONFIG.location}.
              I love building things that live on the internet and help real people.
            </p>
          </div>

          {/* Quick facts */}
          <div className="flex flex-wrap gap-3">
            {[
              { icon: <MapPin className="h-3.5 w-3.5" />,  text: SITE_CONFIG.location },
              { icon: <Coffee className="h-3.5 w-3.5" />,  text: 'Coffee addict' },
              { icon: <Code2  className="h-3.5 w-3.5" />,  text: 'Open source fan' },
            ].map((fact) => (
              <div
                key={fact.text}
                className={cn(
                  'flex items-center gap-2',
                  'px-3 py-1.5 rounded-full',
                  'glass border border-[hsl(var(--border-default))]',
                  'text-xs text-[hsl(var(--text-secondary))]',
                )}
              >
                <span className="text-[hsl(var(--violet))]">{fact.icon}</span>
                {fact.text}
              </div>
            ))}
          </div>

          {/* Status badge */}
          {SITE_CONFIG.available && (
            <div className={cn(
              'inline-flex items-center gap-2',
              'px-4 py-2 rounded-full',
              'glass border border-[hsl(var(--emerald)/0.3)]',
              'text-xs font-medium text-[hsl(var(--emerald))]',
            )}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--emerald))] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--emerald))]" />
              </span>
              Available for new opportunities
            </div>
          )}
        </motion.div>

        {/* RIGHT — Avatar card */}
        <motion.div variants={fadeInRight} className="flex justify-center">
          <div className="relative">
            {/* Glow behind avatar */}
            <div className={cn(
              'absolute inset-0 rounded-2xl',
              'bg-[radial-gradient(ellipse_at_center,hsl(var(--violet)/0.3),transparent_70%)]',
              'blur-2xl scale-110',
            )} />

            {/* Avatar box */}
            <div className={cn(
              'relative w-64 h-64 rounded-2xl',
              'glass-violet',
              'flex items-center justify-center',
              'text-8xl select-none',
            )}>
              👨‍💻
              {/* Corner decorations */}
              <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[hsl(var(--violet))]" />
              <div className="absolute bottom-3 left-3 h-2 w-2 rounded-full bg-[hsl(var(--blue))]" />
            </div>

            {/* Floating badge — top right */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className={cn(
                'absolute -top-4 -right-4',
                'glass border border-[hsl(var(--border-default))]',
                'px-3 py-2 rounded-xl',
                'text-xs font-mono',
              )}
            >
              <span className="text-[hsl(var(--emerald))]">const</span>{' '}
              <span className="text-[hsl(var(--blue))]">dev</span>{' '}
              <span className="text-[hsl(var(--text-muted))]">=</span>{' '}
              <span className="text-[hsl(var(--violet))]">&quot;awesome&quot;</span>
            </motion.div>

            {/* Floating badge — bottom left */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className={cn(
                'absolute -bottom-4 -left-4',
                'glass border border-[hsl(var(--border-default))]',
                'px-3 py-2 rounded-xl',
                'text-xs',
              )}
            >
              ⚡ Full-Stack Dev
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  )
}
