/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { ErrorCode } from '@/utils/auth'
import { createProtectedRouter } from '@/server'
import { nanoid } from 'nanoid'
import { createInvoiceSchema } from '.'

export const invoiceRouter = createProtectedRouter()
    .mutation('create', {
        input: createInvoiceSchema,
        async resolve({ ctx, input }) {
            if (!ctx.user) {
                throw new TRPCError({ message: ErrorCode.UserNotFound, code: 'NOT_FOUND' })
            }

            const invoice = await ctx.prisma.invoice.create({
                data: {
                    ...input,
                    publicId: nanoid(),
                    senderId: ctx.user.id,
                },
            })
            return invoice
        },
    })
    // read
    .query('all', {
        async resolve({ ctx }) {
            /**
             * For pagination you can have a look at this docs site
             * @link https://trpc.io/docs/useInfiniteQuery
             */

            return ctx.prisma.invoice.findMany({
                where: {
                    senderId: ctx.user.id,
                },
                include: {
                    payee: {
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
            id: z.string().cuid(),
        }),
        async resolve({ ctx, input }) {
            const { id } = input
            const invoice = await ctx.prisma.invoice.findFirst({
                where: { senderId: ctx.user.id, id: id },
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
            id: z.string().cuid(),
            data: createInvoiceSchema
        }),
        async resolve({ ctx, input }) {
            const { id, data } = input
            const invoice = await ctx.prisma.invoice.findFirst({
                where: { senderId: ctx.user.id, id: id },
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
        input: z.string().cuid(),
        async resolve({ input: id, ctx }) {
            const invoice = await ctx.prisma.invoice.findFirst({
                where: { senderId: ctx.user.id, id: id },
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
