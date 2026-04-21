import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Add it to backend/.env or project .env before running seed.')
}

const databaseUrl = process.env.DATABASE_URL
const prisma = databaseUrl.startsWith('prisma://') || databaseUrl.startsWith('prisma+postgres://')
  ? new PrismaClient({ accelerateUrl: databaseUrl })
  : new PrismaClient({
      adapter: new PrismaPg({ connectionString: databaseUrl }),
    })

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.contactMessage.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.project.deleteMany()

  console.log('🗑️  Cleared existing data')

  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title:       'Portfolio Website',
        description: 'This portfolio built with Next.js 14, Three.js, and Framer Motion.',
        techStack:   ['Next.js', 'TypeScript', 'Three.js', 'Framer Motion'],
        githubUrl:   'https://github.com/yourusername/portfolio',
        liveUrl:     'https://yourportfolio.com',
        featured:    true,
        gradient:    'from-violet-500/20 to-blue-500/20',
        category:    'Frontend',
        order:       1,
      },
    }),
    prisma.project.create({
      data: {
        title:       'Real-time Dashboard',
        description: 'Live analytics dashboard with Socket.io and Redis.',
        techStack:   ['React', 'Socket.io', 'Redis', 'Node.js'],
        githubUrl:   'https://github.com/yourusername/dashboard',
        liveUrl:     'https://dashboard.example.com',
        featured:    true,
        gradient:    'from-blue-500/20 to-cyan-500/20',
        category:    'Full-Stack',
        order:       2,
      },
    }),
    prisma.project.create({
      data: {
        title:       'AI Writing Tool',
        description: 'SaaS product powered by Gemini API.',
        techStack:   ['Next.js', 'Gemini API', 'Supabase', 'Stripe'],
        githubUrl:   'https://github.com/yourusername/ai-writer',
        liveUrl:     'https://aiwriter.example.com',
        featured:    true,
        gradient:    'from-cyan-500/20 to-emerald-500/20',
        category:    'Full-Stack',
        order:       3,
      },
    }),
    prisma.project.create({
      data: {
        title:       'E-commerce API',
        description: 'REST API for an e-commerce platform.',
        techStack:   ['Node.js', 'Express', 'PostgreSQL', 'Prisma'],
        githubUrl:   'https://github.com/yourusername/ecommerce-api',
        featured:    false,
        gradient:    'from-emerald-500/20 to-amber-500/20',
        category:    'Backend',
        order:       4,
      },
    }),
  ])

  console.log(`✅ Created ${projects.length} projects`)

  const posts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title:     'How I Built My Portfolio with Next.js 14',
        slug:      'how-i-built-my-portfolio-nextjs-14',
        excerpt:   'A complete walkthrough of building a modern portfolio with App Router and Three.js.',
        content:   '# How I Built My Portfolio\n\nFull article content here...',
        tags:      ['Next.js', 'Three.js', 'Portfolio'],
        published: true,
        readTime:  8,
      },
    }),
    prisma.blogPost.create({
      data: {
        title:     'Understanding Zustand for State Management',
        slug:      'understanding-zustand-state-management',
        excerpt:   'Why Zustand is the simplest state management solution for React.',
        content:   '# Understanding Zustand\n\nFull article content here...',
        tags:      ['React', 'Zustand', 'State Management'],
        published: true,
        readTime:  6,
      },
    }),
    prisma.blogPost.create({
      data: {
        title:     'PostgreSQL + Prisma: The Perfect Combination',
        slug:      'postgresql-prisma-perfect-combination',
        excerpt:   'How to use Prisma ORM with PostgreSQL to build type-safe queries.',
        content:   '# PostgreSQL + Prisma\n\nFull article content here...',
        tags:      ['PostgreSQL', 'Prisma', 'Backend'],
        published: true,
        readTime:  10,
      },
    }),
  ])

  console.log(`✅ Created ${posts.length} blog posts`)

  const messages = await Promise.all([
    prisma.contactMessage.create({
      data: {
        name:    'John Smith',
        email:   'john@example.com',
        subject: 'Job opportunity',
        message: 'Hi! I saw your portfolio and I am very impressed. We have a full-stack position open.',
        read:    true,
      },
    }),
    prisma.contactMessage.create({
      data: {
        name:    'Sarah Johnson',
        email:   'sarah@example.com',
        subject: 'Freelance project',
        message: 'Hello! I need a full-stack developer for a 3-month project.',
        read:    false,
      },
    }),
  ])

  console.log(`✅ Created ${messages.length} contact messages`)
  console.log('\n🎉 Database seeded successfully!\n')
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
