import { InveeLogo } from '@/components'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Index() {
    const { data: session, status: sessionStatus } = useSession()

    if (sessionStatus === 'loading') return <div className="p-8 font-medium">Loading ...</div>

    return (
        <div className="grid h-full grid-rows-sandwich divide-y divide-neutral-200 bg-white">
            <header className="flex w-full items-center justify-between bg-white p-6 text-xs font-medium text-neutral-700 md:container md:mx-auto md:text-sm">
                <h1 className="hidden font-heading text-3xl">invee</h1>
                {session ? (
                    <>
                        <span className="text-sm font-medium md:text-base">
                            Welcome, <span className="font-semibold">{session.user.name}</span>
                        </span>
                        <span className="space-x-3 divide-x divide-neutral-300 md:space-x-4">
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
                    </>
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
                <div className="flex w-full flex-col items-baseline justify-center rounded-sm border border-neutral-200 bg-white py-8 px-6 md:container md:mx-auto md:w-auto md:flex-row md:px-16 md:py-16">
                    <div className="w-48 border-b border-neutral-200 pb-8 md:w-72 md:border-b-0 md:border-r md:pb-8 md:pr-8">
                        <InveeLogo color="#262626" />
                    </div>
                    <div className="mt-4 place-self-center md:mt-0 md:pt-0 md:pl-8">
                        <h2 className="bg-gradient-to-r from-blue-400 via-yellow-500 to-green-500 bg-clip-text py-2 font-caption text-4xl text-transparent md:text-5xl">
                            The premier way of managing invoices
                        </h2>
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
