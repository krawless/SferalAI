import { PrismaClient } from '@prisma/client';

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required. Please set it in your .env file.');
}

if (!process.env.NODE_ENV) {
  throw new Error('NODE_ENV environment variable is required. Please set it in your .env file.');
}

const NODE_ENV = process.env.NODE_ENV;

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
