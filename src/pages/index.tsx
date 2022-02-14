import { InveeLogo } from '@/components'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Index() {
    const { data: session, status: sessionStatus } = useSession()

    if (sessionStatus === 'loading') return <div className="p-8 font-medium">Loading ...</div>

    return (
        <div className="grid h-full grid-rows-sandwich divide-y divide-neutral-200 bg-white">
            <header className="flex w-full items-center justify-between bg-white p-6 font-medium text-neutral-700 md:container md:mx-auto">
                <h1 className="font-heading text-3xl">invee</h1>
                {session ? (
                    <div className="flex items-center space-x-10">
                        <span className="text-base font-medium">
                            Welcome, <span className="font-semibold">{session.user.name}</span>
                        </span>
                        <span className="space-x-4 divide-x divide-neutral-300">
                            <Link href="/dashboard">
                                <a className="cursor-pointer font-semibold text-neutral-500 hover:underline">
                                    Go to Dashboard
                                </a>
                            </Link>
                            <a
                                onClick={async () => await signOut()}
                                className="cursor-pointer pl-4 font-semibold text-neutral-500 hover:underline"
                            >
                                Logout
                            </a>
                        </span>
                    </div>
                ) : (
                    <span className="space-x-4 divide-x divide-neutral-300 text-sm">
                        <Link href="/auth/login">
                            <a className="cursor-pointer font-semibold text-neutral-500 hover:underline">Login</a>
                        </Link>
                        <Link href="/signup">
                            <a className="cursor-pointer pl-4 font-semibold text-neutral-500 hover:underline">
                                Sign Up
                            </a>
                        </Link>
                    </span>
                )}
            </header>
            <main className="grid place-items-center text-neutral-800 heropattern-squares-neutral-100">
                <div className="mx-2 flex flex-col justify-center rounded-sm border border-neutral-200 bg-white p-8 md:mx-auto md:flex-row md:p-16">
                    <div className="w-60 border-b border-neutral-200 pb-8 md:w-72 md:border-b-0 md:border-r md:pb-8 md:pr-8">
                        <InveeLogo color="#262626" />
                    </div>
                    <div className="place-self-center pt-8 md:pt-0 md:pl-8">
                        <h2 className="font-caption text-4xl font-medium">The premier way of managing invoices</h2>
                    </div>
                </div>
            </main>
            <footer className="grid w-full place-items-center bg-neutral-900 py-16 text-sm text-neutral-400">
                <p>
                    © 2022 Invee. By{' '}
                    <a
                        href="https://nikolayrademacher.net"
                        target="_blank"
                        className="cursor-pointer text-neutral-500 hover:text-neutral-400"
                        rel="noreferrer"
                    >
                        Nikolay Rademacher
                    </a>
                </p>
            </footer>
        </div>
    )
}
