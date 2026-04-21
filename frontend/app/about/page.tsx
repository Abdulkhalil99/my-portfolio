import { Metadata } from 'next'
import { AboutHero } from '@/components/sections/about/AboutHero'
import { MyStory } from '@/components/sections/about/MyStory'
import { Experience } from '@/components/sections/about/Experience'
import { Values } from '@/components/sections/about/Values'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about my story, experience, and values.',
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MyStory />
      <Experience />
      <Values />
    </>
  )
}
