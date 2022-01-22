import { FieldValues, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { trpc } from '@/lib/trpc'

export default function SignUp() {
    const { register, handleSubmit } = useForm()
    const [password, setPassword] = useState('')

    const { status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/')
        }
    }, [status, router])

    const utils = trpc.useContext()
    const createUser = trpc.useMutation(['user.create'], {
        async onSuccess({ email }) {
            // refetches users after a user is added
            await utils.invalidateQueries(['user.all'])
            await signIn('credentials', { email, password, callbackUrl: '/' })
        },
    })

    if (status !== 'unauthenticated') return null

    return (
        <main className="flex flex-col justify-center items-center h-full">
            <div>
                <h2 className="mb-6 text-3xl font-bold text-center">Sign Up</h2>
                <form
                    className="flex flex-col space-y-8 border rounded p-4 w-[20rem]"
                    onSubmit={handleSubmit(async (data: FieldValues) => {
                        setPassword(data.password)
                        await createUser.mutateAsync({
                            name: data.username,
                            password: data.password,
                            email: data.email,
                        })
                    })}
                >
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                {...register('username')}
                                className="border-gray-300 border rounded"
                            />
                        </div>
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
                        Sign Up
                    </button>
                </form>
            </div>
        </main>
    )
}
