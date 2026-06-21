import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.')
  }

  const pool = new Pool({
    connectionString,
    max: 10, // Avoid holding too many connections in serverless environments
    idleTimeoutMillis: 10000, // Close idle connections after 10 seconds to avoid stale Neon sockets
    connectionTimeoutMillis: 5000, // Do not let connection attempts hang indefinitely
  })

  // Prevent unexpected pool connection errors from crashing the Node process
  pool.on('error', (err) => {
    console.error('[Pg Pool Error]: Unexpected error on idle client', err)
  })

  const adapter = new PrismaPg(pool)

  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton()

export default db

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db
