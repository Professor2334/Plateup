import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('DATABASE_URL is not set during build. Using dummy connection string.')
    }
  }

  const pool = new Pool({
    connectionString: connectionString || 'postgres://dummy:dummy@localhost:5432/dummy',
    max: 10,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 20000,
    allowExitOnIdle: true, // Crucial for serverless environments to prevent timeouts
  })

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
