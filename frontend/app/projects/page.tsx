import { Metadata } from 'next'
import { ProjectsHero } from '@/components/sections/projects/ProjectsHero'
import { ProjectsGrid } from '@/components/sections/projects/ProjectsGrid'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A collection of things I have built.',
}

export default function ProjectsPage() {
  return (
    <>
      <ProjectsHero />
      <ProjectsGrid />
    </>
  )
}
