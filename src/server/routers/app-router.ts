import { createRouter } from '../create-router'
import superjson from 'superjson'
import { userRouter } from './user'
import { projectRouter } from './project'
import { invoiceRouter } from './invoice'
import { itemRouter } from './item'

/**
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
    /**
     * Add data transformers
     * @link https://trpc.io/docs/data-transformers
     */
    .transformer(superjson)
    /**
     * Optionally do custom error (type safe!) formatting
     * @link https://trpc.io/docs/error-formatting
     */
    // .formatError(({ shape, error }) => { })
    .merge('user.', userRouter)
    .merge('project.', projectRouter)
    .merge('invoice.', invoiceRouter)
    .merge('item.', itemRouter)

export type AppRouter = typeof appRouter
