import { Metadata } from 'next'
import { SkillsHero } from '@/components/sections/skills/SkillsHero'
import { SkillsGrid } from '@/components/sections/skills/SkillsGrid'
import { CurrentlyLearning } from '@/components/sections/skills/CurrentlyLearning'
import { Tools } from '@/components/sections/skills/Tools'

export const metadata: Metadata = {
  title: 'Skills',
  description: 'My technical skills and tools I use.',
}

export default function SkillsPage() {
  return (
    <>
      <SkillsHero />
      <SkillsGrid />
      <Tools />
      <CurrentlyLearning />
    </>
  )
}
