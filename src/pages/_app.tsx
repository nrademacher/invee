import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { AppType } from 'next/dist/shared/lib/utils'
import type { AppRouter } from '@/server/routers/_app'

import type { Maybe } from '@trpc/server'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { withTRPC } from '@trpc/next'
import { TRPCClientError } from '@trpc/client'

import { SessionProvider } from 'next-auth/react'
import { DefaultLayout } from '@/components'

import superjson from 'superjson'

import '@/styles/globals.css'

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const MyApp = (({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
    const getLayout =
        Component.getLayout ??
        (page => (
            <SessionProvider session={session}>
                <DefaultLayout>{page}</DefaultLayout>
            </SessionProvider>
        ))

    return getLayout(<Component {...pageProps} />)
}) as AppType

function getBaseUrl() {
    if (process.browser) {
        return ''
    }
    // reference for vercel.com
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`
    }

    // // reference for render.com
    if (process.env.RENDER_INTERNAL_HOSTNAME) {
        return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`
    }

    // assume localhost
    return `http://localhost:${process.env.PORT ?? 3000}`
}

export default withTRPC<AppRouter>({
    config() {
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         */
        return {
            /**
             * @link https://trpc.io/docs/links
             */
            links: [
                // adds pretty logs to your console in development and logs errors in production
                loggerLink({
                    enabled: opts =>
                        process.env.NODE_ENV === 'development' ||
                        (opts.direction === 'down' && opts.result instanceof Error),
                }),
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                }),
            ],
            /**
             * @link https://react-query.tanstack.com/reference/QueryClient
             */
            queryClientConfig: {
                defaultOptions: {
                    queries: {
                        /**
                         * 1s should be enough to just keep identical query waterfalls low
                         * @example if one page components uses a query that is also used further down the tree
                         */
                        staleTime: 1000,
                        /**
                         * Retry `useQuery()` calls depending on this function
                         */
                        retry(failureCount, _err) {
                            const err = _err as never as Maybe<TRPCClientError<AppRouter>>
                            const code = err?.data?.code
                            if (code === 'BAD_REQUEST' || code === 'FORBIDDEN' || code === 'UNAUTHORIZED') {
                                // if input data is wrong or you're not authorized there's no point retrying a query
                                return false
                            }
                            const MAX_QUERY_RETRIES = 3
                            return failureCount < MAX_QUERY_RETRIES
                        },
                    },
                },
            },
            /**
             * @link https://trpc.io/docs/data-transformers
             */
            transformer: superjson,
        }
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
    ssr: false,
})(MyApp)
