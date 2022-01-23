import type { NextPageWithLayout } from './_app'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

const IndexPage: NextPageWithLayout = () => {
    const { data: session } = useSession()

    // const utils = trpc.useContext()

    // prefetch all posts for instant navigation
    // useEffect(() => {
    //     for (const { id } of postsQuery.data ?? []) {
    //         utils.prefetchQuery(['post.byId', { id }])
    //     }
    // }, [postsQuery.data, utils])


    return (
        <div className="">
            <header className="mb-12 flex justify-between items-start">
                <div>
                    <h1 className="text-6xl mb-4">Welcome to your tRPC starter!</h1>
                    <p>
                        Check <a href="https://trpc.io/docs">the docs</a> whenever you get stuck, or ping{' '}
                        <a
                            className="text-blue-500 cursor-pointer hover:underline"
                            href="https://twitter.com/alexdotjs"
                        >
                            @alexdotjs
                        </a>{' '}
                        on Twitter.
                    </p>
                </div>
                {session && (
                    <div className="flex items-baseline space-x-8">
                        <span className="text-sm">
                            Welcome, <span className="font-semibold">{session.user.name}</span>
                        </span>
                        <a
                            onClick={async () => await signOut()}
                            className="text-blue-500 font-semibold cursor-pointer hover:underline"
                        >
                            Logout
                        </a>
                    </div>
                )}
            </header>
            {session ? (
                <div>
                    Welcome to <strong>inv</strong>! (WIP)
                </div>
            ) : (
                <div className="space-y-2">
                    <p className="text-lg font-medium">
                        <Link href="/auth/login">
                            <a className="text-blue-500 cursor-pointer hover:underline">Sign in </a>
                        </Link>
                        to view and create invoices!
                    </p>
                    <p>
                        Need an acount?
                        <Link href="/signup">
                            <a className="text-blue-500 cursor-pointer hover:underline"> Sign up</a>
                        </Link>
                    </p>
                </div>
            )}
        </div>
    )
}

export default IndexPage
