/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/auth'

const prisma = new PrismaClient()

async function main() {
    const passwordHash = await hashPassword('hello-world-password')
    const { id } = await prisma.user.create({
        data: {
            email: 'hello@world.com',
            name: 'hello-world-user',
            passwordHash,
        },
    })

    await prisma.post.create({
        data: {
            title: 'First Post',
            text: 'This is an example post generated from `prisma/seed.ts`',
            userId: id,
        },
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
