import { createProtectedRouter } from '@/server'
import { createItemSchema, editItemSchema } from './item-input'
import { TRPCError } from '@trpc/server'
import { ErrorCode } from '@/utils/auth'
import { z } from 'zod'

export const itemRouter = createProtectedRouter()
    .mutation('create', {
        input: createItemSchema,
        async resolve({ ctx, input }) {
            if (!ctx.user) {
                throw new TRPCError({ message: ErrorCode.UserNotFound, code: 'NOT_FOUND' })
            }

            const item = await ctx.prisma.item.create({
                data: {
                    ...input,
                },
            })
            return item
        },
    })
    .query('all', {
        async resolve({ ctx }) {
            /**
             * For pagination you can have a look at this docs site
             * @link https://trpc.io/docs/useInfiniteQuery
             */

            return ctx.prisma.item.findMany({
                where: {
                    invoice: {
                        userId: ctx.user.id,
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
            const item = await ctx.prisma.item.findFirst({
                where: { invoice: { userId: ctx.user.id }, id: input.id },
            })
            if (!item) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Item not found',
                })
            }
            return item
        },
    })
    .mutation('edit', {
        input: z.object({
            id: z.string().cuid(),
            data: editItemSchema,
        }),
        async resolve({ ctx, input }) {
            const { id, data } = input
            const item = await ctx.prisma.item.findFirst({
                where: { invoice: { userId: ctx.user.id }, id: id },
            })
            if (!item) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Item not found',
                })
            }
            await ctx.prisma.item.update({
                where: { id },
                data,
            })
            return item
        },
    })
    .mutation('delete', {
        input: z.string().cuid(),
        async resolve({ input: id, ctx }) {
            const item = await ctx.prisma.item.findFirst({
                where: { invoice: { userId: ctx.user.id }, id: id },
            })
            if (!item) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Item not found',
                })
            }
            await ctx.prisma.item.delete({ where: { id } })
            return id
        },
    })
