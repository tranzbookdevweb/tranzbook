// app/lib/db.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        // Use direct connection in production to avoid PgBouncer caching
        url: process.env.NODE_ENV === 'production' 
          ? process.env.DIRECT_URL 
          : process.env.DATABASE_URL
      }
    },
  })
}

// Create a separate client for operations that need fresh data
const freshPrismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DIRECT_URL // Always use direct connection
      }
    },
  })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
  var freshPrismaGlobal: undefined | ReturnType<typeof freshPrismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
const freshPrisma = globalThis.freshPrismaGlobal ?? freshPrismaClientSingleton()

export default prisma
export { freshPrisma }

// Only set global in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
  globalThis.freshPrismaGlobal = freshPrisma
}

// Handle cleanup for serverless environments
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
    await freshPrisma.$disconnect()
  })
}