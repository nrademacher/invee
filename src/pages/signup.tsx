import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema } from '@/server/routers/user/user-inputs'
import { useTRPCContext, useTRPCMutation } from '@/lib/trpc'

const PrereleaseDisclaimer: React.FC = () => (
    <article className="rounded-sm border border-yellow-400 bg-yellow-200 p-4 text-yellow-600">
        <h3 className="mb-2 font-bold">Disclaimer:</h3>
        <p className="text-sm">
            This is a preview version of invee, not the final product. Things may change fundamentally without notice,
            and any data stored may be permanently lost. By signing up, you are acknowledging these conditions.
        </p>
    </article>
)

export default function SignUp() {
    const { status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [status, router])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(createUserSchema), mode: 'onSubmit' })
    const [password, setPassword] = useState('')

    const { invalidateQueries } = useTRPCContext()
    const createUser = useTRPCMutation(['user.create'], {
        async onSuccess({ email }) {
            await invalidateQueries(['user.all'])
            await signIn('credentials', { email, password, callbackUrl: '/dashboard' })
        },
    })

    if (status !== 'unauthenticated') return null

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <div>
                <h2 className="mb-6 text-center text-3xl font-bold">Sign Up</h2>
                <form
                    className="mx-auto flex w-full flex-col space-y-8 rounded border p-4 md:w-1/4"
                    onSubmit={handleSubmit(async data => {
                        setPassword(data.password)
                        await createUser.mutateAsync({
                            name: data.name,
                            password: data.password,
                            email: data.email,
                        })
                    })}
                >
                    <PrereleaseDisclaimer />
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label className="mb-1 text-sm" htmlFor="name">
                                Username
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register('name')}
                                className="rounded border border-gray-300"
                            />
                            {errors.name?.message && <p>{errors.name?.message}</p>}
                        </div>
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
                            {errors.email?.message && <p>{errors.email?.message}</p>}
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
                            {errors.password?.message && <p>{errors.password?.message}</p>}
                        </div>
                    </div>
                    <button
                        className="rounded bg-gray-900 py-3 px-7 font-semibold text-white hover:bg-gray-600"
                        type="submit"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </main>
    )
}
