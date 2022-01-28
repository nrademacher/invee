import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'

import { FieldValues, useForm } from 'react-hook-form'

export default function LogIn() {
    const { status } = useSession()
    const router = useRouter()
    const { register, handleSubmit } = useForm()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/')
        }
    }, [status, router])

    if (status !== 'unauthenticated') return null

    return (
        <>
            <main className="flex h-full items-center justify-center">
                <div>
                    <h2 className="mb-6 text-center text-3xl font-bold">Login</h2>
                    <form
                        className="flex w-[20rem] flex-col space-y-8 rounded border p-4"
                        onSubmit={handleSubmit(async ({ email, password }: FieldValues) => {
                            await signIn('credentials', { email, password, callbackUrl: '/' })
                        })}
                    >
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className="rounded border border-gray-300"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 text-sm" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className="rounded border border-gray-300"
                                />
                            </div>
                        </div>
                        <button
                            className="rounded bg-gray-900 py-3 px-7 font-semibold text-white hover:bg-gray-600"
                            type="submit"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </main>
        </>
    )
}
