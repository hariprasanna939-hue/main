import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  pgPool: Pool;
};

const connectionString = process.env.DATABASE_URL!;

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const client = new PrismaClient({ adapter });
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = client;
      globalForPrisma.pgPool = pool;
    }
    return client;
  })();

