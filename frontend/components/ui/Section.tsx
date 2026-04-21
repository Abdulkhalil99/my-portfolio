// Section wraps major parts of a page.
// It handles: spacing, background variants, and the title/subtitle.

import { cn } from '@/lib/utils'
import { Container } from './Container'

type SectionVariant = 
  | 'default'   // Normal dark background
  | 'elevated'  // Slightly lighter background
  | 'gradient'  // Subtle gradient background

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: SectionVariant
  
  // Optional header content
  eyebrow?: string     // Small text above title: "My Work"
  title?: string       // Big section title
  subtitle?: string    // Description below title
  centered?: boolean   // Center the header text?

  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const variantStyles: Record<SectionVariant, string> = {
  default: 'bg-transparent',
  elevated: 'bg-[hsl(var(--bg-elevated)/0.5)]',
  gradient: cn(
    'relative overflow-hidden',
    'before:absolute before:inset-0',
    'before:bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,hsl(var(--violet)/0.06),transparent)]',
    'before:pointer-events-none',
  ),
}

export function Section({
  variant = 'default',
  eyebrow,
  title,
  subtitle,
  centered = false,
  containerSize = 'xl',
  children,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        'section-padding',      // from globals.css — responsive padding
        'relative',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      <Container size={containerSize}>

        {/* SECTION HEADER — only renders if title exists */}
        {(eyebrow || title || subtitle) && (
          <div
            className={cn(
              'mb-12 md:mb-16',
              centered && 'text-center',
            )}
          >
            {/* EYEBROW — small label above title */}
            {eyebrow && (
              <div className="inline-flex items-center gap-2 mb-4">
                {/* Left line */}
                <span className="h-px w-6 bg-[hsl(var(--violet))]" />

                <span className={cn(
                  'text-xs font-semibold uppercase tracking-[0.15em]',
                  'text-[hsl(var(--violet))]',
                )}>
                  {eyebrow}
                </span>

                {/* Right line */}
                <span className="h-px w-6 bg-[hsl(var(--violet))]" />
              </div>
            )}

            {/* TITLE */}
            {title && (
              <h2 className={cn(
                'text-balance',
                centered && 'mx-auto',
              )}>
                {title}
              </h2>
            )}

            {/* SUBTITLE */}
            {subtitle && (
              <p className={cn(
                'mt-4 text-base md:text-lg',
                'text-[hsl(var(--text-secondary))]',
                'max-w-2xl text-balance',
                centered && 'mx-auto',
              )}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* PAGE CONTENT */}
        {children}

      </Container>
    </section>
  )
}