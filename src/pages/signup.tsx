import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema } from '@/server/routers/user/input-schemata'

export default function SignUp() {
    const { status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/')
        }
    }, [status, router])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(createUserSchema), mode: 'onSubmit' })
    const [password, setPassword] = useState('')

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
                    onSubmit={handleSubmit(async data => {
                        setPassword(data.password)
                        await createUser.mutateAsync({
                            name: data.name,
                            password: data.password,
                            email: data.email,
                        })
                    })}
                >
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label className="text-sm mb-1" htmlFor="name">
                                Username
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register('name')}
                                className="border-gray-300 border rounded"
                            />
                            {errors.name?.message && <p>{errors.name?.message}</p>}
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
                            {errors.email?.message && <p>{errors.email?.message}</p>}
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
                            {errors.password?.message && <p>{errors.password?.message}</p>}
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
