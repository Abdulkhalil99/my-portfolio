'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge }  from '@/components/ui/Badge'
import { cn }     from '@/lib/utils'
import { SITE_CONFIG } from '@/lib/constants'
import { staggerContainer, fadeInUp, fadeIn } from '@/lib/animations'

/*
  We load HeroScene with dynamic import.

  WHY?
  Three.js is a large library (~600kb).
  We do not want it to block the initial page load.

  dynamic() = load this component only when needed
  ssr: false = do not try to render 3D on the server
               (Three.js needs the browser's WebGL)
*/
import dynamic from 'next/dynamic'

const HeroScene = dynamic(
  () => import('@/components/three/HeroScene').then(m => m.HeroScene),
  {
    ssr:     false,    // WebGL only works in browser
    loading: () => null, // show nothing while loading
  }
)

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y       = useTransform(scrollYProgress, [0, 1], ['0px', '100px'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative min-h-screen',
        'flex items-center justify-center',
        'overflow-hidden pt-16',
      )}
    >

      {/* ==============================
          3D BACKGROUND SCENE
          Rendered behind everything
      ============================== */}
      <HeroScene />

      {/* ==============================
          GRADIENT OVERLAYS
          These sit on top of 3D but
          behind the text content
      ============================== */}
      <div aria-hidden className="absolute inset-0 -z-[5] pointer-events-none">
        {/* Top glow */}
        <div className={cn(
          'absolute top-0 left-1/2 -translate-x-1/2',
          'h-[500px] w-[800px]',
          'bg-[radial-gradient(ellipse_at_top,hsl(var(--violet)/0.15),transparent_70%)]',
        )} />

        {/* Bottom fade — makes 3D blend into page */}
        <div className={cn(
          'absolute bottom-0 left-0 right-0 h-48',
          'bg-gradient-to-t from-[hsl(var(--bg-base))] to-transparent',
        )} />

        {/* Side fades */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[hsl(var(--bg-base))] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[hsl(var(--bg-base))] to-transparent" />
      </div>

      {/* ==============================
          HERO CONTENT
          Normal HTML on top of 3D
      ============================== */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 w-full"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center"
          >

            {/* Available badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              {SITE_CONFIG.available ? (
                <div className={cn(
                  'inline-flex items-center gap-2',
                  'px-4 py-2 rounded-full',
                  'glass border border-[hsl(var(--emerald)/0.25)]',
                  'text-xs font-medium text-[hsl(var(--emerald))]',
                )}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--emerald))] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--emerald))]" />
                  </span>
                  Available for new projects
                </div>
              ) : (
                <div className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-full',
                  'glass border border-[hsl(var(--border-default))]',
                  'text-xs font-medium text-[hsl(var(--text-muted))]',
                )}>
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--text-muted))]" />
                  Currently unavailable
                </div>
              )}
            </motion.div>

            {/* Main title */}
            <motion.div variants={fadeInUp} className="mb-6">
              <h1 className="text-balance">
                <span className="block text-[hsl(var(--text-secondary))] text-2xl sm:text-3xl font-normal mb-2">
                  Hi, I am{' '}
                  <span className="text-[hsl(var(--text-primary))] font-semibold">
                    {SITE_CONFIG.firstName}
                  </span>{' '}
                  <motion.span
                    animate={{ rotate: [0, 20, -10, 20, 0] }}
                    transition={{
                      duration:    1.5,
                      delay:       1.5,
                      repeat:      Infinity,
                      repeatDelay: 3,
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    👋
                  </motion.span>
                </span>
                <span className="text-gradient leading-[1.1]">
                  {SITE_CONFIG.title}
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className={cn(
                'mb-10 max-w-2xl',
                'text-lg sm:text-xl',
                'text-[hsl(var(--text-secondary))]',
                'text-balance leading-relaxed',
              )}
            >
              {SITE_CONFIG.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center gap-4 mb-12"
            >
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5" />}
                onClick={() => {
                  document.getElementById('projects')?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }}
              >
                View My Work
              </Button>
              <Link href="/contact">
                <Button variant="glass" size="lg">
                  Let us Talk
                </Button>
              </Link>
            </motion.div>

            {/* Social links */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-6 mb-16"
            >
              <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--text-muted))]">
                <MapPin className="h-3.5 w-3.5" />
                {SITE_CONFIG.location}
              </div>
              <span className="h-4 w-px bg-[hsl(var(--border-default))]" />
              <div className="flex items-center gap-3">
                {[
                  { href: SITE_CONFIG.github,   label: 'GitHub'   },
                  { href: SITE_CONFIG.linkedin, label: 'LinkedIn' },
                ].map(({ href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[hsl(var(--text-muted))] hover:text-[hsl(var(--violet))] transition-colors duration-200"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Tech stack badges */}
            <motion.div
              variants={fadeIn}
              className="flex flex-wrap justify-center gap-2"
            >
              <span className="text-xs text-[hsl(var(--text-muted))] self-center mr-2">
                Built with:
              </span>
              {['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Three.js'].map(tech => (
                <Badge key={tech} variant="default">{tech}</Badge>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--text-muted))]">
            Scroll
          </span>
          <div className={cn(
            'h-10 w-5 rounded-full',
            'border border-[hsl(var(--border-strong))]',
            'flex items-start justify-center p-1',
          )}>
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-2 w-1 rounded-full bg-[hsl(var(--violet))]"
            />
          </div>
        </motion.div>
      </motion.div>

    </section>
  )
}
