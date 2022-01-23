/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */

import { createRouter } from '@/server/create-router'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { ErrorCode, hashPassword, verifyPassword } from '@/utils/auth'
import isStrongPassword from 'validator/lib/isStrongPassword'
import { createProtectedRouter } from '..'

export const publicUserRouter = createRouter()
    .query('session', {
        resolve({ ctx }) {
            return ctx.session
        },
    })
    .mutation('create', {
        input: z.object({
            email: z.string().email(),
            password: z
                .string()
                .min(8)
                .refine(val => isStrongPassword(val)),
            name: z.string().min(3).max(64),
            streedAddress: z.string().min(1).optional(),
            city: z.string().min(1).optional(),
            postCode: z.string().min(1).optional(),
            country: z.string().min(1).optional(),
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

export const authenticatedUserRouter = createProtectedRouter()
    .query('current', {
        async resolve({ ctx }) {
            /**
             * For pagination you can have a look at this docs site
             * @link https://trpc.io/docs/useInfiniteQuery
             */

            if (!ctx.user) {
                throw new TRPCError({ message: ErrorCode.UserNotFound, code: 'NOT_FOUND' })
            }

            const { id, email, name, createdAt } = ctx.user
            const currentUser = { id, email, name, createdAt }

            return currentUser
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
                    email: true,
                    name: true,
                    createdAt: true,
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
                    id: true,
                    email: true,
                    name: true,
                    createdAt: true,
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
            password: z.string(),
            data: z.object({
                email: z.string().email().optional(),
                password: z
                    .string()
                    .min(8)
                    .refine(val => isStrongPassword(val)),
                name: z.string().min(3).max(64),
                streedAddress: z.string().min(1).optional(),
                city: z.string().min(1).optional(),
                postCode: z.string().min(1).optional(),
                country: z.string().min(1).optional(),
            }),
        }),
        async resolve({ ctx, input }) {
            const { password, data } = input

            if (!verifyPassword(password, ctx.user.passwordHash)) {
                throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Incorrect password' })
            }

            const user = await ctx.prisma.user.update({
                where: { id: ctx.user.id },
                data,
            })
            return user
        },
    })
    .mutation('delete', {
        async resolve({ ctx }) {
            await ctx.prisma.user.delete({
                where: {
                    id: ctx.user.id,
                },
            })
            return
        },
    })

export const userRouter = createRouter().merge(publicUserRouter).merge(authenticatedUserRouter)
