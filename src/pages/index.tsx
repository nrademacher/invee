import type { NextPageWithLayout } from './_app'
import { signOut, useSession } from 'next-auth/react'
import { trpc } from '@/lib/trpc'
import { useEffect } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createInvoiceSchema } from '@/server/routers/invoice/input-schemata'
import Link from 'next/link'


const IndexPage: NextPageWithLayout = () => {
    const { data: session } = useSession()

    const utils = trpc.useContext()
    const invoicesQuery = trpc.useQuery(['invoice.all'], {})
    const createInvoice = trpc.useMutation(['invoice.create'], {
       async onSuccess() {
            await utils.invalidateQueries(['invoice.all'])
        },
    })

    // prefetch all posts for instant navigation
    useEffect(() => {
        for (const { id } of invoicesQuery.data ?? []) {
            utils.prefetchQuery(['invoice.byId', { id }])
        }
    }, [invoicesQuery.data, utils])


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ resolver: zodResolver(createInvoiceSchema), mode: "onSubmit" })

    return (
        <div className="">
            <header className="mb-12 flex justify-between items-start">
                <div>
                    <h1 className="text-6xl mb-4">
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
                            className="text-blue-500 font-semibold cursor-pointer hover:underline"
                        >
                            Logout
                        </a>
                    </div>
                )}
            </header>
            {session && invoicesQuery.data ? (
                <div>
                    <h2 className="text-3xl font-semibold mb-6">Invoices</h2>

                    <div className="flex items-start space-x-8">
                        <section className="grid grid-cols-3 gap-4">
                            {invoicesQuery.data.map(item => (
                                <article className="rounded p-4 space-y-2 border min-w-[25rem]" key={item.id}>
                                    <h3 className="text-xl font-medium">{item.publicId}</h3>
                                    <p>
                                        <span className="font-medium">Status: </span>
                                        {item.status}
                                    </p>
                                    <p>
                                        <span className="font-medium">Project: </span>
                                        {item.projectName}
                                    </p>
                                    <p>
                                        <span className="font-medium">Payment Terms: </span>
                                        {item.paymentTerms.replace('_', ' ')}
                                    </p>
                                    <p>
                                        <span className="font-medium">Client: </span>
                                        {item.payee.name}
                                    </p>
                                </article>
                            ))}
                        </section>
                        <form
                            className="w-[25rem] p-4 flex flex-col space-y-3 rounded border"
                            onSubmit={handleSubmit(async (data: FieldValues) => {
                            console.log("ID ", session.user.id)
                                await createInvoice.mutateAsync({
                                    projectName: data.projectName,
                                    payeeId: String(session.user.id),
                                })
                            })}
                        >
                            <div className="flex flex-col">
                                <label className="text-sm font-medium mb-1" htmlFor="project-name">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    id="project-name"
                                    {...register('projectName')}
                                    className="rounded border border-gray-300"
                                    disabled={createInvoice.isLoading}
                                />
                                {errors.projectName?.message && <p>{errors.projectName?.message}</p>}
                            </div>

                            <input
                                className="cursor-pointer w-1/3 border rounded p-2 self-end font-medium"
                                type="submit"
                                disabled={createInvoice.isLoading}
                            />
                            {createInvoice.error && <p className="text-red-600">{createInvoice.error.message}</p>}
                        </form>
                    </div>
                </div>
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
