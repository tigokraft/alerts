// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ['query'], // Uncomment if you want to see queries in console
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
