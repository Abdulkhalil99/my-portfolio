import pkg from '@prisma/client'

const { PrismaClient } = pkg as any
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ========================
  // CLEAR EXISTING DATA
  // So we can run seed multiple times safely
  // ========================
  await prisma.contactMessage.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.project.deleteMany()

  console.log('🗑️  Cleared existing data')

  // ========================
  // SEED PROJECTS
  // ========================
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title:       'Portfolio Website',
        description: 'This portfolio built with Next.js 14, Three.js, and Framer Motion. Features 3D animations, dark/light mode, blog, and AI chatbot.',
        techStack:   ['Next.js', 'TypeScript', 'Three.js', 'Framer Motion', 'Prisma'],
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
        description: 'Live analytics dashboard with Socket.io and Redis. Shows real-time data updates without page refresh. Handles 10,000+ concurrent users.',
        techStack:   ['React', 'Socket.io', 'Redis', 'Node.js', 'PostgreSQL'],
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
        description: 'SaaS product powered by Gemini API. Helps users write better content 10x faster. Stripe payments, Supabase auth, 500+ active users.',
        techStack:   ['Next.js', 'Gemini API', 'Supabase', 'Stripe', 'Prisma'],
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
        description: 'REST API for an e-commerce platform. Handles orders, inventory, payments with Stripe. 99.9% uptime in production.',
        techStack:   ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Redis'],
        githubUrl:   'https://github.com/yourusername/ecommerce-api',
        featured:    false,
        gradient:    'from-emerald-500/20 to-amber-500/20',
        category:    'Backend',
        order:       4,
      },
    }),

    prisma.project.create({
      data: {
        title:       'Weather App',
        description: 'Clean weather app with location detection, 7-day forecast, and beautiful animations. Uses OpenWeather API.',
        techStack:   ['React', 'TypeScript', 'Tailwind CSS'],
        githubUrl:   'https://github.com/yourusername/weather',
        liveUrl:     'https://weather.example.com',
        featured:    false,
        gradient:    'from-amber-500/20 to-rose-500/20',
        category:    'Frontend',
        order:       5,
      },
    }),
  ])

  console.log(`✅ Created ${projects.length} projects`)

  // ========================
  // SEED BLOG POSTS
  // ========================
  const posts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title:    'How I Built My Portfolio with Next.js 14',
        slug:     'how-i-built-my-portfolio-nextjs-14',
        excerpt:  'A complete walkthrough of building a modern portfolio with App Router, Three.js 3D animations, and Framer Motion. Everything I learned along the way.',
        content:  '# How I Built My Portfolio\n\nThis is the full article content...',
        tags:     ['Next.js', 'Three.js', 'Portfolio', 'TypeScript'],
        published: true,
        readTime:  8,
        metaTitle: 'Building a Portfolio with Next.js 14',
      },
    }),

    prisma.blogPost.create({
      data: {
        title:    'Understanding Zustand for State Management',
        slug:     'understanding-zustand-state-management',
        excerpt:  'Why Zustand is the simplest and most powerful state management solution for React apps. Compared with Redux and Context API.',
        content:  '# Understanding Zustand\n\nThis is the full article content...',
        tags:     ['React', 'Zustand', 'State Management'],
        published: true,
        readTime:  6,
      },
    }),

    prisma.blogPost.create({
      data: {
        title:    'PostgreSQL + Prisma: The Perfect Combination',
        slug:     'postgresql-prisma-perfect-combination',
        excerpt:  'How to use Prisma ORM with PostgreSQL to build type-safe database queries. From setup to advanced patterns.',
        content:  '# PostgreSQL + Prisma\n\nThis is the full article content...',
        tags:     ['PostgreSQL', 'Prisma', 'Backend', 'TypeScript'],
        published: true,
        readTime:  10,
      },
    }),
  ])

  console.log(`✅ Created ${posts.length} blog posts`)

  // ========================
  // SEED CONTACT MESSAGES
  // ========================
  const messages = await Promise.all([
    prisma.contactMessage.create({
      data: {
        name:    'John Smith',
        email:   'john@example.com',
        subject: 'Job opportunity',
        message: 'Hi! I saw your portfolio and I am very impressed. We have a full-stack position open at our startup. Would you be interested in talking?',
        read:    true,
      },
    }),

    prisma.contactMessage.create({
      data: {
        name:    'Sarah Johnson',
        email:   'sarah@example.com',
        subject: 'Freelance project',
        message: 'Hello! I need a full-stack developer for a 3-month project. Budget is flexible. Please let me know if you are available.',
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
    // Always disconnect when done
    await prisma.$disconnect()
  })
