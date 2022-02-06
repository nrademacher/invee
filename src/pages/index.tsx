import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Index() {
    const { data: session, status: sessionStatus } = useSession()

    if (sessionStatus === 'loading') return <div className="p-8">Loading ...</div>

    return (
        <div className="p-8">
            <header className="mb-12 flex items-start justify-between">
                <div>
                    <h1 className="mb-4 text-6xl">
                        Welcome to <strong>inv</strong>!
                    </h1>
                    <p>The premier way for managing invoices</p>
                </div>
                {session && (
                    <div className="flex items-baseline space-x-8">
                        <span className="text-sm">
                            Welcome, <span className="font-semibold">{session.user.name}</span>
                        </span>
                        <a
                            onClick={async () => await signOut()}
                            className="cursor-pointer font-semibold text-blue-500 hover:underline"
                        >
                            Logout
                        </a>
                    </div>
                )}
            </header>
            {!session && (
                <div className="space-y-2">
                    <p className="text-lg font-medium">
                        <Link href="/auth/login">
                            <a className="cursor-pointer text-blue-500 hover:underline">Sign in </a>
                        </Link>
                        to view and create posts!
                    </p>
                    <p>
                        Need an acount?
                        <Link href="/signup">
                            <a className="cursor-pointer text-blue-500 hover:underline"> Sign up</a>
                        </Link>
                    </p>
                </div>
            )}
        </div>
    )
}
