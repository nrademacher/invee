import { createInvoiceSchema, editInvoiceSchema } from './invoice-inputs'
import { createProtectedRouter } from '@/server'
import { ErrorCode } from '@/utils/auth'
import { TRPCError } from '@trpc/server'
import { nanoid } from 'nanoid'
import { z } from 'zod'

export const invoiceRouter = createProtectedRouter()
    .mutation('create', {
        input: createInvoiceSchema,
        async resolve({ ctx, input }) {
            if (!ctx.user) {
                throw new TRPCError({ message: ErrorCode.UserNotFound, code: 'NOT_FOUND' })
            }

            const { items, ...rest } = input

            const invoice = await ctx.prisma.invoice.create({
                data: {
                    ...rest,
                    publicId: nanoid(),
                    userId: ctx.user.id,
                    items: {
                        createMany: {
                            data: items,
                        },
                    },
                    total: items.reduce((current, item) => item.price + current, 0),
                },
            })
            return invoice
        },
    })
    .query('all', {
        async resolve({ ctx }) {
            /**
             * For pagination you can have a look at this docs site
             * @link https://trpc.io/docs/useInfiniteQuery
             */

            return ctx.prisma.invoice.findMany({
                where: {
                    userId: ctx.user.id,
                },
                include: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            })
        },
    })
    .query('byId', {
        input: z.object({
            id: z.number(),
        }),
        async resolve({ ctx, input }) {
            const { id } = input
            const invoice = await ctx.prisma.invoice.findFirst({
                where: { userId: ctx.user.id, id: id },
                include: {
                    project: true,
                    items: true,
                },
            })
            if (!invoice) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Invoice not found',
                })
            }
            return invoice
        },
    })
    .mutation('edit', {
        input: z.object({
            id: z.number(),
            data: editInvoiceSchema,
        }),
        async resolve({ ctx, input }) {
            const { id, data } = input
            const invoice = await ctx.prisma.invoice.findFirst({
                where: { userId: ctx.user.id, id: id },
            })
            if (!invoice) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Invoice not found',
                })
            }
            await ctx.prisma.invoice.update({
                where: { id },
                data,
            })
            return invoice
        },
    })
    .mutation('delete', {
        input: z.number(),
        async resolve({ input: id, ctx }) {
            const invoice = await ctx.prisma.invoice.findFirst({
                where: { userId: ctx.user.id, id: id },
            })
            if (!invoice) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Invoice not found',
                })
            }
            await ctx.prisma.invoice.delete({ where: { id } })
            return id
        },
    })
