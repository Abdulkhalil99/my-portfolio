// Badges are small labels — used for tech stack tags, categories etc.

import { cn } from '@/lib/utils'

type BadgeVariant = 'violet' | 'blue' | 'cyan' | 'emerald' | 'rose' | 'amber' | 'default'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  'bg-[hsl(var(--bg-overlay))] text-[hsl(var(--text-secondary))] border-[hsl(var(--border-default))]',
  violet:   'bg-[hsl(var(--violet)/0.1)]  text-[hsl(var(--violet))]  border-[hsl(var(--violet)/0.3)]',
  blue:     'bg-[hsl(var(--blue)/0.1)]    text-[hsl(var(--blue))]    border-[hsl(var(--blue)/0.3)]',
  cyan:     'bg-[hsl(var(--cyan)/0.1)]    text-[hsl(var(--cyan))]    border-[hsl(var(--cyan)/0.3)]',
  emerald:  'bg-[hsl(var(--emerald)/0.1)] text-[hsl(var(--emerald))] border-[hsl(var(--emerald)/0.3)]',
  rose:     'bg-[hsl(var(--rose)/0.1)]    text-[hsl(var(--rose))]    border-[hsl(var(--rose)/0.3)]',
  amber:    'bg-[hsl(var(--amber)/0.1)]   text-[hsl(var(--amber))]   border-[hsl(var(--amber)/0.3)]',
}

export function Badge({
  variant = 'default',
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        'px-2.5 py-0.5',
        'text-xs font-medium',
        'rounded-full border',
        'transition-colors duration-200',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}