import prisma from '../lib/prisma'
import { appRouter } from '@/server/routers/app-router'
import { createSSGHelpers } from '@trpc/react/ssg'
import { GetStaticPropsContext } from 'next'
import superjson from 'superjson'

/**
 * Initialize static site rendering tRPC helpers.
 * Provides a method to prefetch tRPC-queries in a `getStaticProps`-function.
 * Make sure to `return { props: { trpcState: ssr.dehydrate() } }` at the end.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function ssgInit<TParams extends { locale?: string }>(opts: GetStaticPropsContext<TParams>) {
    const ssg = createSSGHelpers({
        router: appRouter,
        transformer: superjson,
        ctx: {
            prisma,
            session: null,
            user: null,
        },
    })

    return ssg
}
