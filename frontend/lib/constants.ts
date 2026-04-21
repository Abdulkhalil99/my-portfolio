import type { NavItem } from '@/types'

export const SITE_CONFIG = {
  name: 'Abdul Khalil',
  firstName: 'Abdul',
  title: 'Full-Stack Developer',
  tagline: 'I build fast, beautiful, and scalable web apps.',
  description: 'A full-stack developer specialized in React, Node.js, and modern web technologies. I turn ideas into real products.',
  email: 'mohammadiabdulkhalil99@gmail.com',
  location: 'Kabul, Afghanistan',
  available: true,
  github:   'https://github.com/Abdulkhalil99',
  linkedin: 'https://linkedin.com/in/abdulkhalil-mohammadi',
  twitter:  'https://twitter.com/yourusername',
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home',     href: '/' },
  { label: 'About',    href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Skills',   href: '/skills' },
  { label: 'Contact',  href: '/contact' },
]

export const STATS = [
  { value: '2+',  label: 'Years Experience' },
  { value: '20+', label: 'Projects Built' },
  { value: '10+', label: 'Happy Clients' },
  { value: '99%', label: 'Coffee Powered' },
]

export const SKILLS = [
  { name: 'Next.js',    category: 'Frontend', level: 90 },
  { name: 'React',      category: 'Frontend', level: 90 },
  { name: 'TypeScript', category: 'Frontend', level: 85 },
  { name: 'Tailwind',   category: 'Frontend', level: 90 },
  { name: 'Node.js',    category: 'Backend',  level: 80 },
  { name: 'Express',    category: 'Backend',  level: 80 },
  { name: 'PostgreSQL', category: 'Backend',  level: 75 },
  { name: 'Prisma',     category: 'Backend',  level: 75 },
  { name: 'Docker',     category: 'Tools',    level: 65 },
  { name: 'Git',        category: 'Tools',    level: 85 },
]

export const FEATURED_PROJECTS = [
  {
    id: '1',
    title: 'Project One',
    description: 'A full-stack web app built with Next.js and PostgreSQL.',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    githubUrl: 'https://github.com',
    liveUrl:   'https://example.com',
    featured:  false,
    gradient:  'from-violet-500/20 to-blue-500/20',
  },
  {
    id: '2',
    title: 'Project Two',
    description: 'Real-time dashboard with Socket.io and Redis.',
    techStack: ['React', 'Socket.io', 'Redis', 'Node.js'],
    githubUrl: 'https://github.com',
    liveUrl:   'https://example.com',
    featured:  true,
    gradient:  'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: '3',
    title: 'Project Three',
    description: 'AI-powered SaaS with Gemini API.',
    techStack: ['Next.js', 'Gemini API', 'Supabase', 'Stripe'],
    githubUrl: 'https://github.com',
    liveUrl:   'https://example.com',
    featured:  true,
    gradient:  'from-cyan-500/20 to-emerald-500/20',
  },
]
