/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { createRouter } from '@/server/create-router'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { ErrorCode } from '@/utils/auth'

export const postRouter = createRouter()
    // create
    .mutation('add', {
        input: z.object({
            title: z.string().min(1).max(32),
            text: z.string().min(1),
        }),
        async resolve({ ctx, input }) {
            if (!ctx.user) {
                throw new TRPCError({ message: ErrorCode.UserNotFound, code: 'NOT_FOUND' })
            }

            const post = await ctx.prisma.post.create({
                data: {
                    ...input,
                    userId: ctx.user.id,
                },
            })
            return post
        },
    })
    // read
    .query('all', {
        async resolve({ ctx }) {
            /**
             * For pagination you can have a look at this docs site
             * @link https://trpc.io/docs/useInfiniteQuery
             */

            return ctx.prisma.post.findMany({
                select: {
                    id: true,
                    title: true,
                    user: {
                        select: {
                            name: true,
                            id: true,
                        },
                    },
                },
            })
        },
    })
    .query('byId', {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ ctx, input }) {
            const { id } = input
            const post = await ctx.prisma.post.findUnique({
                where: { id },
                select: {
                    user: true,
                    id: true,
                    title: true,
                    text: true,
                    createdAt: true,
                    updatedAt: true,
                },
            })
            if (!post) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `No post with id '${id}'`,
                })
            }
            return post
        },
    })
    // update
    .mutation('edit', {
        input: z.object({
            id: z.string().uuid(),
            data: z.object({
                title: z.string().min(1).max(32).optional(),
                text: z.string().min(1).optional(),
            }),
        }),
        async resolve({ ctx, input }) {
            const { id, data } = input
            const post = await ctx.prisma.post.update({
                where: { id },
                data,
            })
            return post
        },
    })
    // delete
    .mutation('delete', {
        input: z.string().uuid(),
        async resolve({ input: id, ctx }) {
            await ctx.prisma.post.delete({ where: { id } })
            return id
        },
    })
