import { PrismaClient } from '@prisma/client'

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

export const prisma =
    globalThis.prisma ||
    new PrismaClient({
        log: ['query', 'error', 'warn'],
    })

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

if (!IS_PRODUCTION) {
    globalThis.prisma = prisma
}

export default prisma
