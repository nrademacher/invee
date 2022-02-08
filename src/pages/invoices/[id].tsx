import { formatPaymentTerms, useSessionGuard } from '@/lib'
import { trpc } from '@/lib/trpc'
import NextError from 'next/error'
import { Button, RefLink, SidebarLayout } from '@/components'
import { ArrowLeftIcon, CheckCircleIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'

export default function InvoicePage() {
    const { session, status, query } = useSessionGuard()
    const invoiceQuery = trpc.useQuery(['invoice.byId', { id: Number(query.id) }])

    const { push } = useRouter()
    const { invalidateQueries } = trpc.useContext()
    const deleteInvoice = trpc.useMutation(['invoice.delete'], {
        async onSuccess() {
            console.log('SUCCESS')
            push('/outbox')
            await invalidateQueries(['invoice.all'])
        },
    })
    const editInvoice = trpc.useMutation(['invoice.edit'], {
        async onSuccess() {
            console.log('SUCCESS')
            await invoiceQuery.refetch()
        },
    })

    if (invoiceQuery.error) {
        return <NextError title={invoiceQuery.error.message} statusCode={invoiceQuery.error.data?.httpStatus ?? 500} />
    }
    if (invoiceQuery.status !== 'success') {
        return <div>Loading...</div>
    }

    const { data: invoice } = invoiceQuery

    if (status === 'loading' || !session || !invoice) return <div>Loading ...</div>

    return (
        <SidebarLayout pageName={`Invoice #${invoice.id}`} currentUserName={session.user.name as string}>
            <main className="mx-2 grid w-full place-items-center lg:mx-24">
                <article className="mt-4 w-full divide-y divide-neutral-200 rounded-sm border border-neutral-200 bg-white p-12 lg:mt-0 lg:max-w-screen-lg">
                    <header className="flex flex-col items-center justify-between pb-4 md:flex-row">
                        <h1 className="mb-4 font-heading text-5xl md:mb-0 lg:text-6xl">Invoice #{invoice.id}</h1>
                        <div className="flex justify-between">
                            <Button
                                onClick={async () => await deleteInvoice.mutateAsync(invoice.id)}
                                icon={<TrashIcon />}
                                danger
                                className="mr-4"
                            >
                                Delete
                            </Button>
                            {invoice.isDraft ? (
                                <Button
                                    onClick={async () =>
                                        await editInvoice.mutateAsync({
                                            id: invoice.id,
                                            data: { isDraft: false },
                                        })
                                    }
                                    icon={<ExclamationCircleIcon />}
                                    danger
                                >
                                    Remove Draft status
                                </Button>
                            ) : (
                                <Button
                                    onClick={async () =>
                                        await editInvoice.mutateAsync({
                                            id: invoice.id,
                                            data: { status: invoice.status === 'PENDING' ? 'PAID' : 'PENDING' },
                                        })
                                    }
                                    icon={
                                        invoice.status === 'PENDING' ? <CheckCircleIcon /> : <ExclamationCircleIcon />
                                    }
                                    primary
                                >
                                    {invoice.status === 'PAID' ? 'Mark as Pending' : 'Mark as Paid'}
                                </Button>
                            )}
                        </div>
                    </header>
                    <section className="grid w-full place-items-center py-8">
                        <div className="w-full space-y-4">
                            <table className="table w-full divide-y divide-neutral-200">
                                <thead className="font-heading text-3xl">
                                    <h2 className="mb-3">Client</h2>
                                </thead>
                                <tbody className="w-full">
                                    <tr className="table-row">
                                        <td className="table-cell py-2 font-semibold">Name</td>
                                        <td className="table-cell py-2">{invoice.clientName}</td>
                                    </tr>
                                    <tr className="table-row">
                                        <td className="table-cell py-2 font-semibold">Email</td>
                                        <td className="table-cell py-2">{invoice.clientEmail}</td>
                                    </tr>
                                    <tr className="table-row">
                                        <td className="table-cell py-2 font-medium">Street Address</td>
                                        <td className="table-cell py-3">{invoice.clientStreetAddress}</td>
                                    </tr>
                                    <tr className="table-row">
                                        <td className="table-cell py-2 font-medium">City</td>
                                        <td className="table-cell py-2">{invoice.clientCity}</td>
                                    </tr>
                                    <tr className="table-row">
                                        <td className="table-cell py-2 font-medium">Post Code</td>
                                        <td className="table-cell py-2">{invoice.clientPostCode}</td>
                                    </tr>
                                    <tr className="table-row">
                                        <td className="table-cell py-2 font-medium">Country</td>
                                        <td className="table-cell py-2">{invoice.clientCountry}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table className="table w-full divide-y divide-neutral-200">
                                <thead className="table-header-group font-heading text-3xl">
                                    <h2 className="mb-3">Items</h2>
                                </thead>
                                <tbody className="w-full">
                                    <tr className="table-row">
                                        <td className="table-cell py-2 font-semibold">Name</td>
                                        <td className="table-cell py-2 font-semibold">Price</td>
                                        <td className="table-cell py-2 font-semibold">Quantity</td>
                                        <td className="table-cell py-2 font-semibold">Total</td>
                                    </tr>
                                    {invoice.items.map(item => (
                                        <tr key={item.id} className="table-row">
                                            <td className="table-cell py-2">{item.name}</td>
                                            <td className="table-cell py-2">${item.price}</td>
                                            <td className="table-cell py-2">{item.quantity}</td>
                                            <td className="table-cell py-2">${item.quantity * item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <table className="table w-full divide-y divide-neutral-200">
                                <thead className="font-heading text-3xl">
                                    <h2 className="mb-3">Other</h2>
                                </thead>
                                <tbody className="w-full">
                                    {invoice.project && (
                                        <tr className="table-row">
                                            <td className="table-cell py-2 font-semibold">Project</td>
                                            <td className="table-cell py-2">{invoice.project.projectName}</td>
                                        </tr>
                                    )}
                                    <tr className="table-row">
                                        <td className="table-cell py-2 font-semibold">Payment Terms</td>
                                        <td className="table-cell py-2">{formatPaymentTerms(invoice.paymentTerms)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="text-right text-3xl font-semibold">
                                Total: <span className="font-bold">${invoice.total}</span>
                            </p>
                        </div>
                    </section>
                    <footer className="flex justify-between pt-4">
                        <RefLink href="/outbox">
                            <Button primary icon={<ArrowLeftIcon />}>
                                Back to Outbox
                            </Button>
                        </RefLink>
                    </footer>
                </article>
            </main>
        </SidebarLayout>
    )
}
