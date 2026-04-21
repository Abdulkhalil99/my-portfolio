import 'dotenv/config'
import clientPkg from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
const PrismaClient = (clientPkg as any).PrismaClient ?? (clientPkg as any).default ?? clientPkg

/*
  WHY a singleton?
  
  If we write: const prisma = new PrismaClient()
  in every file that needs the database,
  we create MANY database connections.
  
  Problem: PostgreSQL has a connection limit.
  Free Supabase: max ~20 connections.
  
  If 20 files each create a client = 20 connections = LIMIT REACHED!
  New requests fail with "too many connections" error.
  
  Solution: Create ONE client, use it everywhere.
  This is the singleton pattern.
  
  In development, Next.js hot reload also causes this problem.
  We save the client on the global object to survive hot reloads.
*/
// Extend the global type so TypeScript knows about our prisma instance
declare global {
  // eslint-disable-next-line no-var
  var __prisma: any
}

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is missing. Add it to your .env file.')
  }

  const baseOptions = {
    log: process.env.NODE_ENV === 'development'
      // In development: log all queries so we can debug
      ? ['query', 'error', 'warn']
      // In production: only log errors
      : ['error'],

    errorFormat: process.env.NODE_ENV === 'development'
      ? 'pretty'   // colored, easy to read errors
      : 'minimal', // short errors for production logs
  }

  if (
    databaseUrl.startsWith('prisma://') ||
    databaseUrl.startsWith('prisma+postgres://')
  ) {
    return new PrismaClient({
      ...baseOptions,
      accelerateUrl: databaseUrl,
    })
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl })
  return new PrismaClient({
    ...baseOptions,
    adapter,
  })
}

// Use existing client if it exists (hot reload protection)
// Create new client if it does not exist yet
const prisma = global.__prisma ?? createPrismaClient()

// Save to global in development only
if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma
}

export default prisma
