import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../styles/globals.css'
import { Navbar }          from '@/components/layout/Navbar'
import { Footer }          from '@/components/layout/Footer'
import { ThemeProvider }   from '@/components/providers/ThemeProvider'
import { QueryProvider }   from '@/components/providers/QueryProvider'
import { SocketProvider }  from '@/components/providers/SocketProvider'
import { ToastContainer }  from '@/components/ui/Toast'
import { Chatbot }         from '@/components/ui/Chatbot'
import { LiveWidget }      from '@/components/ui/LiveWidget'
import { SITE_CONFIG }     from '@/lib/constants'

const inter = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-inter',
  display:  'swap',
  weight:   '100 900',
})

const jetbrainsMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-jetbrains',
  display:  'swap',
  weight:   '100 800',
})

export const metadata: Metadata = {
  title: {
    default:  `${SITE_CONFIG.name} — ${SITE_CONFIG.title}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords:    ['developer', 'portfolio', 'full-stack', 'react', 'next.js'],
  authors:     [{ name: SITE_CONFIG.name }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[hsl(var(--bg-base))] text-[hsl(var(--text-primary))] font-sans">
        <QueryProvider>
          <ThemeProvider>
            <SocketProvider>

              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>

              {/* Global floating UI */}
              <LiveWidget />
              <ToastContainer />
              <Chatbot />

            </SocketProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
