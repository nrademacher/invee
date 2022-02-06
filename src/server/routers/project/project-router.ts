import { createProtectedRouter } from '@/server'
import { createProjectSchema } from './project-input'
import { TRPCError } from '@trpc/server'
import { ErrorCode } from '@/utils/auth'
import { z } from 'zod'

export const projectRouter = createProtectedRouter()
    .mutation('create', {
        input: createProjectSchema,
        async resolve({ ctx, input }) {
            if (!ctx.user) {
                throw new TRPCError({ message: ErrorCode.UserNotFound, code: 'NOT_FOUND' })
            }

            const project = await ctx.prisma.project.create({
                data: {
                    ...input,
                    userId: ctx.user.id,
                },
            })
            return project
        },
    })
    .query('all', {
        async resolve({ ctx }) {
            /**
             * For pagination you can have a look at this docs site
             * @link https://trpc.io/docs/useInfiniteQuery
             */

            return ctx.prisma.project.findMany({
                where: {
                    userId: ctx.user.id,
                },
            })
        },
    })
    .query('byId', {
        input: z.object({
            id: z.string().cuid(),
        }),
        async resolve({ ctx, input }) {
            const project = await ctx.prisma.project.findFirst({
                where: { userId: ctx.user.id, id: input.id },
            })
            if (!project) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Project not found',
                })
            }
            return project
        },
    })
    .mutation('edit', {
        input: z.object({
            id: z.string().cuid(),
            data: createProjectSchema,
        }),
        async resolve({ ctx, input }) {
            const { id, data } = input
            const project = await ctx.prisma.project.findFirst({
                where: { userId: ctx.user.id, id: id },
            })
            if (!project) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Project not found',
                })
            }
            await ctx.prisma.project.update({
                where: { id },
                data,
            })
            return project
        },
    })
    .mutation('delete', {
        input: z.string().cuid(),
        async resolve({ input: id, ctx }) {
            const project = await ctx.prisma.project.findFirst({
                where: { userId: ctx.user.id, id: id },
            })
            if (!project) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Project not found',
                })
            }
            await ctx.prisma.project.delete({ where: { id } })
            return id
        },
    })
