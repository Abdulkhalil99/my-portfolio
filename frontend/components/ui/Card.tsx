// Card is a container for content — projects, blog posts, etc.
// We build variants for different use cases.

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type CardVariant = 
  | 'default'   // Simple dark card
  | 'glass'     // Glassmorphism
  | 'violet'    // Violet glow accent
  | 'blue'      // Blue glow accent
  | 'outline'   // Just a border, no bg

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  hover?: boolean      // Add hover lift effect?
  glow?: boolean       // Add glow on hover?
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const variantStyles: Record<CardVariant, string> = {
  default: cn(
    'bg-[hsl(var(--bg-elevated))]',
    'border border-[hsl(var(--border-default))]',
  ),
  glass: cn(
    'glass',
  ),
  violet: cn(
    'glass-violet',
  ),
  blue: cn(
    'glass-blue',
  ),
  outline: cn(
    'bg-transparent',
    'border border-[hsl(var(--border-strong))]',
  ),
}

const paddingStyles = {
  none: 'p-0',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hover = false,
      glow = false,
      padding = 'md',
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base
          'relative rounded-[var(--radius-lg)]',
          'overflow-hidden',           // Clips children to rounded corners
          'transition-all duration-300',

          // Variant
          variantStyles[variant],

          // Padding
          paddingStyles[padding],

          // Hover lift effect
          hover && [
            'hover:-translate-y-1',
            'hover:shadow-[0_20px_40px_hsl(var(--bg-base)/0.8)]',
            'cursor-pointer',
          ],

          // Glow on hover
          glow && [
            'hover:border-[hsl(var(--violet)/0.4)]',
            'hover:shadow-[0_0_30px_hsl(var(--violet)/0.15)]',
          ],

          className,
        )}
        {...props}
      >
        {/* TOP SHINE LINE (premium detail) */}
        {/* This creates the subtle light reflection at the top of cards */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute top-0 left-0 right-0 h-px',
            'bg-gradient-to-r',
            'from-transparent via-[hsl(var(--glass-border)/0.15)] to-transparent',
            'pointer-events-none'
          )}
        />

        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// ========================
// SUB-COMPONENTS
// Makes it easy to structure card content:
// <Card>
//   <CardHeader>...</CardHeader>
//   <CardBody>...</CardBody>
//   <CardFooter>...</CardFooter>
// </Card>
// ========================

type CardSectionProps = React.HTMLAttributes<HTMLDivElement>

export function CardHeader({ children, className, ...props }: CardSectionProps) {
  return (
    <div
      className={cn('mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardBody({ children, className, ...props }: CardSectionProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }: CardSectionProps) {
  return (
    <div
      className={cn(
        'mt-4 pt-4',
        'border-t border-[hsl(var(--border-subtle))]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
