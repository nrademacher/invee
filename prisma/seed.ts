/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/utils/auth'
import faker from '@faker-js/faker'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()
async function main() {
    const passwordHash = await hashPassword('hello-world-password')
    const { id: userId } = await prisma.user.create({
        data: {
            email: 'hello@world.com',
            name: faker.name.findName(),
            streetAddress: faker.address.streetAddress(),
            city: faker.address.city(),
            postCode: faker.address.zipCode(),
            country: faker.address.country(),
            passwordHash,
        },
    })

    const { id: clientId } = await prisma.client.create({
        data: {
            email: 'hello@world.com',
            name: faker.name.findName(),
            streetAddress: faker.address.streetAddress(),
            city: faker.address.city(),
            postCode: faker.address.zipCode(),
            country: faker.address.country(),
        },
    })

    await prisma.invoice.create({
        data: {
            status: 'PENDING',
            publicId: nanoid(),
            projectName: 'hello world invoice',
            paymentTerms: 'NET_30',
            clientId,
            userId,
            items: {
                create: {
                    name: 'Hello world item',
                    price: 99,
                    quantity: 3,
                },
            },
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
