// No 'use client' — this is a server component
// It just imports and arranges client components

import { Hero }             from '@/components/sections/Hero'
import { Stats }            from '@/components/sections/Stats'
import { About }            from '@/components/sections/About'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { CTA }              from '@/components/sections/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <FeaturedProjects />
      <CTA />
    </>
  )
}