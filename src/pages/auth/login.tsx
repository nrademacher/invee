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
            <main className="flex items-center justify-center h-full">
                <div>
                    <h2 className="mb-6 text-3xl font-bold text-center">Login</h2>
                    <form
                        className="flex flex-col space-y-8 border rounded p-4 w-[20rem]"
                        onSubmit={handleSubmit(async ({ email, password }: FieldValues) => {
                            await signIn('credentials', { email, password, callbackUrl: '/' })
                        })}
                    >
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-sm mb-1" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className="border-gray-300 border rounded"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm mb-1" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className="border-gray-300 border rounded"
                                />
                            </div>
                        </div>
                        <button
                            className="py-3 px-7 font-semibold text-white bg-gray-900 rounded hover:bg-gray-600"
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
