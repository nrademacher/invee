import type { GetServerSidePropsContext } from 'next'

import type { Maybe } from '@trpc/server'
import type { Session } from 'next-auth'

import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

import prisma from '@/lib/prisma'
import { getSession } from '@/utils'

type CreateContextOptions = trpcNext.CreateNextContextOptions | GetServerSidePropsContext

async function getUserFromSession({ session }: { session: Maybe<Session>; req?: CreateContextOptions['req'] }) {
    if (!session?.user?.id) {
        return null
    }
    const user = await prisma.user.findUnique({
        where: {
            id: String(session.user.id),
        },
    })

    // some hacks to make sure `username` and `email` are never inferred as `null`
    if (!user) {
        return null
    }
    const { email, name } = user
    if (!email) {
        return null
    }

    return {
        ...user,
        email,
        name,
    }
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({ req }: CreateContextOptions) => {
    // for API-response caching see https://trpc.io/docs/caching
    const session = await getSession({ req })

    const user = await getUserFromSession({ session, req })
    return {
        prisma,
        session,
        user,
    }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
