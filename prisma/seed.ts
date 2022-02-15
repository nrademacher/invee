/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { hashPassword } from '../src/utils/auth'
import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

async function main() {
    const passwordHash = await hashPassword('hello-world')
    const { id: userId } = await prisma.user.create({
        data: {
            email: 'debug@testuser.com',
            name: 'debug user',
            passwordHash,
        },
    })

    await prisma.invoice.create({
        data: {
            status: 'PENDING',
            publicId: nanoid(),
            paymentTerms: 'NET_30',
            isDraft: true,
            userCity: 'debug user city',
            userCountry: 'debug user country',
            userPostCode: 'debug user post code',
            userStreetAddress: 'debug user street address',
            clientCity: 'debug payee city',
            clientCountry: 'debug payee country',
            clientEmail: 'debug@debugpayee.com',
            clientName: 'debug payee',
            clientPostCode: 'debug payee postcode',
            userId,
            clientStreetAddress: 'debug street address',
            items: {
                create: {
                    name: 'debug item',
                    price: 99,
                    quantity: 3,
                },
            },
            total: 3 * 99,
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
