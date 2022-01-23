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
    let passwordHash = await hashPassword(faker.internet.password())
    const { id: senderId } = await prisma.user.create({
        data: {
            email: faker.internet.email(),
            name: faker.name.findName(),
            streetAddress: faker.address.streetAddress(),
            city: faker.address.city(),
            postCode: faker.address.zipCode(),
            country: faker.address.country(),
            passwordHash,
        },
    })

    passwordHash = await hashPassword(faker.internet.password())
    const { id: payeeId } = await prisma.user.create({
        data: {
            email: faker.internet.email(),
            name: faker.name.findName(),
            streetAddress: faker.address.streetAddress(),
            city: faker.address.city(),
            postCode: faker.address.zipCode(),
            country: faker.address.country(),
            passwordHash
        },
    })

    await prisma.invoice.create({
        data: {
            status: 'PENDING',
            publicId: nanoid(),
            projectName: 'hello world invoice',
            paymentTerms: 'NET_30',
            senderId,
            payeeId,
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
