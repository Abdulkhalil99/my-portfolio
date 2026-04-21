// Button is the most used component in any app.
// We build ONE Button that handles ALL cases.

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// ========================
// TYPE DEFINITIONS
// forwardRef needs these to be explicit
// ========================

// All the different visual styles our button can have
type ButtonVariant = 
  | 'primary'    // Main CTA — glowing violet
  | 'secondary'  // Second choice — outlined violet
  | 'ghost'      // Invisible until hovered
  | 'glass'      // Glassmorphism style
  | 'danger'     // Delete / destructive actions

// Size options
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

// Our custom props + ALL normal HTML button props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean          // Shows spinner when true
  leftIcon?: React.ReactNode   // Icon on the left
  rightIcon?: React.ReactNode  // Icon on the right
}

// ========================
// STYLE MAPS
// Maps variant name → Tailwind classes
// ========================

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-[hsl(var(--violet))] text-white',
    'hover:bg-[hsl(var(--violet-dim))]',
    'shadow-[0_0_20px_hsl(var(--violet)/0.4)]',
    'hover:shadow-[0_0_30px_hsl(var(--violet)/0.6)]',
    'border border-[hsl(var(--violet)/0.5)]',
    'active:scale-[0.98]'
  ),

  secondary: cn(
    'bg-transparent text-[hsl(var(--violet))]',
    'border border-[hsl(var(--violet)/0.5)]',
    'hover:bg-[hsl(var(--violet)/0.08)]',
    'hover:border-[hsl(var(--violet)/0.8)]',
    'hover:shadow-[0_0_20px_hsl(var(--violet)/0.2)]',
    'active:scale-[0.98]'
  ),

  ghost: cn(
    'bg-transparent text-[hsl(var(--text-secondary))]',
    'border border-transparent',
    'hover:bg-[hsl(var(--bg-overlay))]',
    'hover:text-[hsl(var(--text-primary))]',
    'hover:border-[hsl(var(--border-default))]',
    'active:scale-[0.98]'
  ),

  glass: cn(
    'glass text-[hsl(var(--text-primary))]',
    'hover:bg-[hsl(var(--glass-bg)/0.08)]',
    'hover:border-[hsl(var(--glass-border)/0.15)]',
    'hover:shadow-[0_8px_32px_hsl(var(--bg-base)/0.5)]',
    'active:scale-[0.98]'
  ),

  danger: cn(
    'bg-[hsl(var(--rose))] text-white',
    'hover:bg-[hsl(var(--rose)/0.85)]',
    'shadow-[0_0_20px_hsl(var(--rose)/0.3)]',
    'hover:shadow-[0_0_30px_hsl(var(--rose)/0.5)]',
    'border border-[hsl(var(--rose)/0.5)]',
    'active:scale-[0.98]'
  ),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm:   'h-8  px-3 text-xs  gap-1.5 rounded-[var(--radius-sm)]',
  md:   'h-10 px-5 text-sm  gap-2   rounded-[var(--radius-md)]',
  lg:   'h-12 px-8 text-base gap-2.5 rounded-[var(--radius-md)]',
  icon: 'h-10 w-10 p-0      rounded-[var(--radius-md)]',
}

// ========================
// THE COMPONENT
// forwardRef = lets parent components access the DOM button element
// (needed for tooltips, focus management etc.)
// ========================
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props         // all other HTML button attributes (onClick, type, etc.)
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // ---- BASE STYLES (always applied) ----
          'inline-flex items-center justify-center',
          'font-medium',
          'transition-all duration-200',
          'cursor-pointer select-none',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-[hsl(var(--violet))]',
          'focus-visible:ring-offset-2',
          'focus-visible:ring-offset-[hsl(var(--bg-base))]',

          // ---- DISABLED STATE ----
          isDisabled && 'opacity-50 cursor-not-allowed active:scale-100',

          // ---- VARIANT & SIZE ----
          variantStyles[variant],
          sizeStyles[size],

          // ---- CUSTOM CLASSES (from parent) ----
          className,
        )}
        {...props}
      >
        {/* LOADING SPINNER */}
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        {/* LEFT ICON (only if not loading) */}
        {!isLoading && leftIcon && (
          <span className="shrink-0">{leftIcon}</span>
        )}

        {/* BUTTON TEXT */}
        {children}

        {/* RIGHT ICON */}
        {!isLoading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    )
  }
)

// This is needed when using forwardRef
// It gives the component a name in React DevTools
Button.displayName = 'Button'