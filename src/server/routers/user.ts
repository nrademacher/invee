/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { createRouter } from '@/server/create-router'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { ErrorCode, hashPassword } from '@/utils/auth'

export const userRouter = createRouter()
    // create
    .mutation('create', {
        input: z.object({
            email: z.string().email(),
            password: z.string().min(8),
            name: z.string().min(3).max(32),
        }),
        async resolve({ ctx, input }) {
            const { email, password, name } = input
            const exisitingUser = await ctx.prisma.user.findUnique({ where: { email } })
            if (exisitingUser) throw new Error('user_already_exists')
            const passwordHash = await hashPassword(password)

            return await ctx.prisma.user.create({
                data: {
                    email,
                    name,
                    passwordHash,
                },
            })
        },
    })
    // read
    .query('current', {
        async resolve({ ctx }) {
            /**
             * For pagination you can have a look at this docs site
             * @link https://trpc.io/docs/useInfiniteQuery
             */

            if (!ctx.user) {
                throw new TRPCError({ message: ErrorCode.UserNotFound, code: 'NOT_FOUND' })
            }

            return ctx.prisma.user.findFirst({
                where: {
                    id: ctx.user.id,
                },
            })
        },
    })
    .query('all', {
        async resolve({ ctx }) {
            /**
             * For pagination you can have a look at this docs site
             * @link https://trpc.io/docs/useInfiniteQuery
             */

            return ctx.prisma.user.findMany({
                select: {
                    id: true,
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
            const user = await ctx.prisma.user.findUnique({
                where: { id },
                select: {
                    name: true,
                },
            })
            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `No user with id '${id}'`,
                })
            }
            return user
        },
    })
    // update
    .mutation('edit', {
        input: z.object({
            id: z.string().uuid(),
            data: z.object({
                name: z.string().min(3).max(32).optional(),
                email: z.string().email().optional(),
            }),
        }),
        async resolve({ ctx, input }) {
            const { id, data } = input
            const user = await ctx.prisma.user.update({
                where: { id },
                data,
            })
            return user
        },
    })
    // delete
    .mutation('delete', {
        input: z.string().uuid(),
        async resolve({ input: id, ctx }) {
            await ctx.prisma.user.delete({ where: { id } })
            return id
        },
    })
