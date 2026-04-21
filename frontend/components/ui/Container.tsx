// Container keeps content centered and adds consistent side padding.
// Without it, content would stretch to the full screen width — ugly!

import { cn } from '@/lib/utils'

// How wide should the content be?
type ContainerSize = 
  | 'sm'    // 640px  — for narrow content like blog posts
  | 'md'    // 768px  — medium
  | 'lg'    // 1024px — normal pages
  | 'xl'    // 1280px — wide pages
  | 'full'  // 100%   — no max width

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
  as?: React.ElementType  // Render as different HTML element
}

const sizeStyles: Record<ContainerSize, string> = {
  sm:   'max-w-screen-sm',    // 640px
  md:   'max-w-screen-md',    // 768px
  lg:   'max-w-screen-lg',    // 1024px
  xl:   'max-w-[1200px]',     // custom 1200px
  full: 'max-w-full',
}

export function Container({
  size = 'xl',
  as: Component = 'div',
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full',                        // center horizontally
        'px-4 sm:px-6 lg:px-8',                  // responsive side padding
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}