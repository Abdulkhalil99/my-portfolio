import Link from 'next/link'
import { Code2, Heart, ExternalLink } from 'lucide-react'
import { SITE_CONFIG, NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* TOP SECTION */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1 - Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/30">
                <Code2 className="h-4 w-4 text-primary" />
              </div>
              <span className="font-mono text-sm font-bold">
                <span className="text-primary">&lt;</span>
                {SITE_CONFIG.name}
                <span className="text-primary">/&gt;</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Column 2 - Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Navigation
            </h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Find Me Online
            </h3>
            <div className="flex gap-3">
              {[
                { icon: ExternalLink,   href: SITE_CONFIG.github,   label: 'GitHub' },
                { icon: ExternalLink, href: SITE_CONFIG.linkedin, label: 'LinkedIn' },
                { icon: ExternalLink,  href: SITE_CONFIG.twitter,  label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"         // Opens in new tab
                  rel="noopener noreferrer" // Security best practice
                  aria-label={label}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg',
                    'bg-muted border border-border',
                    'text-muted-foreground hover:text-primary',
                    'hover:border-primary/40 hover:bg-primary/10',
                    'transition-all duration-200'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className={cn(
          'py-6 border-t border-border',
          'flex flex-col sm:flex-row items-center justify-between gap-4'
        )}>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            © {currentYear} {SITE_CONFIG.name}. Built with{' '}
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />{' '}
            using Next.js
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            v1.0.0
          </p>
        </div>
        
      </div>
    </footer>
  )
}