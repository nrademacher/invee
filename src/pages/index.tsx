import type { NextPageWithLayout } from './_app'
import { signOut, useSession } from 'next-auth/react'
import { trpc } from '@/lib/trpc'
import { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import Link from 'next/link'

const IndexPage: NextPageWithLayout = () => {
    const { data: session } = useSession()

    const utils = trpc.useContext()

    const postsQuery = trpc.useQuery(['post.all'])

    // prefetch all posts for instant navigation
    useEffect(() => {
        for (const { id } of postsQuery.data ?? []) {
            utils.prefetchQuery(['post.byId', { id }])
        }
    }, [postsQuery.data, utils])

    const userQuery = trpc.useQuery(['user.current'])

    useEffect(() => {
        userQuery.data && utils.prefetchQuery(['user.byId', { id: userQuery.data.id }])
    }, [userQuery.data, utils])

    const addPost = trpc.useMutation('post.add', {
        async onSuccess() {
            // refetches posts after a post is added
            await utils.invalidateQueries(['post.all'])
        },
    })

    const { register, handleSubmit, reset } = useForm()

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
                {session && userQuery.data && (
                    <div className="flex items-baseline space-x-8">
                        <span className="text-sm">
                            Welcome, <span className="font-semibold">{userQuery.data.name}</span>
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
                <>
                    <h2 className="text-3xl font-semibold mb-6">
                        Posts
                        {postsQuery.status === 'loading' && '(loading)'}
                    </h2>

                    <main className="flex items-start space-x-8">
                        <section className="grid grid-cols-3 gap-4">
                            {userQuery.data &&
                                postsQuery.data &&
                                postsQuery.data.map(item => (
                                    <article className="rounded p-4 border min-w-[25rem]" key={item.id}>
                                        <h3 className="mb-4 text-xl font-semibold">{item.title}</h3>
                                        <h4>
                                            By <span className="mb-4 font-medium">{item.user.name}</span>
                                        </h4>
                                        <div className="mt-1.5">
                                            <Link href={`/post/${item.id}`}>
                                                <a className="text-blue-500 hover:underline text-sm">View more</a>
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                        </section>

                        <form
                            className="w-[25rem] p-4 flex flex-col space-y-3 rounded border"
                            onSubmit={handleSubmit(async ({ title, text }: FieldValues) => {
                                await addPost.mutateAsync({ title, text })
                                reset({ title: '', text: '' })
                            })}
                        >
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    {...register('title')}
                                    className="rounded border border-gray-300"
                                    disabled={addPost.isLoading}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1" htmlFor="text">
                                    Text
                                </label>
                                <textarea
                                    id="text"
                                    {...register('text')}
                                    disabled={addPost.isLoading}
                                    className="rounded border border-gray-300"
                                />
                            </div>
                            <input
                                className="cursor-pointer w-1/3 border rounded p-2 self-end font-medium"
                                type="submit"
                                disabled={addPost.isLoading}
                            />
                            {addPost.error && <p className="text-red-600">{addPost.error.message}</p>}
                        </form>
                    </main>
                </>
            ) : (
                <div className="space-y-2">
                    <p className="text-lg font-medium">
                        <Link href="/auth/login">
                            <a className="text-blue-500 cursor-pointer hover:underline">Sign in </a>
                        </Link>
                        to view and create posts!
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
