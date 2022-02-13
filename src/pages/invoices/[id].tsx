import { useSessionGuard } from '@/hooks'
import { formatPaymentTerms } from '@/lib'
import { trpc } from '@/lib/trpc'
import { useRouter } from 'next/router'
import NextError from 'next/error'
import { Button, RefLink, SidebarLayout } from '@/components'
import { ArrowLeftIcon, CheckCircleIcon, ExclamationCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid'
import { EditInvoiceDraft } from '@/components/invoice-form'

export default function InvoicePage() {
    const { session, status, query } = useSessionGuard()
    const invoiceQuery = trpc.useQuery(['invoice.byId', { id: Number(query.id) }])
    const { invalidateQueries } = trpc.useContext()
    const { push } = useRouter()
    const deleteInvoice = trpc.useMutation(['invoice.delete'], {
        async onSuccess() {
            await invalidateQueries(['invoice.all'])
            push('/outbox')
        },
    })
    const editInvoice = trpc.useMutation(['invoice.edit'], {
        async onSuccess() {
            await invoiceQuery.refetch()
        },
    })

    if (invoiceQuery.error) {
        return <NextError title={invoiceQuery.error.message} statusCode={invoiceQuery.error.data?.httpStatus ?? 500} />
    }
    if (invoiceQuery.status !== 'success') {
        return <div className="mx-auto h-full w-full">Loading...</div>
    }

    const { data: invoice } = invoiceQuery

    if (status === 'loading' || !session || !invoice) return <div className="mx-auto h-full w-full">Loading ...</div>

    return (
        <SidebarLayout pageName={`Invoice #${invoice.id}`} currentUserName={session.user.name as string}>
            <main className="mx-2 mt-4 grid place-items-center lg:mx-0 lg:mt-0 lg:h-full">
                <article className="w-full divide-y divide-neutral-300 rounded-sm border border-neutral-200 bg-white p-12 lg:mt-0 lg:max-w-screen-lg">
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
                                            data: { isDraft: false, items: invoice.items },
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
                                            data: {
                                                status: invoice.status === 'PENDING' ? 'PAID' : 'PENDING',
                                                items: invoice.items,
                                            },
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
                    <section className="grid w-full place-items-center space-y-8 divide-y divide-neutral-200 py-8">
                        <article className="w-full">
                            <h2 className="mb-3 font-heading text-3xl">Client</h2>
                            <table className="table w-full">
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
                        </article>
                        <article className="w-full pt-4">
                            <h2 className="mb-3 font-heading text-3xl">Items</h2>
                            <table className="table w-full">
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
                        </article>
                        <article className="w-full pt-4">
                            <h2 className="mb-3 font-heading text-3xl">Other</h2>
                            <table className="table w-full">
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
                        </article>
                        <p className="w-full pt-8 text-right text-3xl font-semibold">
                            Total: <span className="font-bold">${invoice.total}</span>
                        </p>
                    </section>
                    <footer className="flex justify-between pt-4">
                        <RefLink href="/outbox">
                            <Button primary icon={<ArrowLeftIcon />}>
                                Back to Outbox
                            </Button>
                        </RefLink>
                        {invoice.isDraft && (
                            <EditInvoiceDraft
                                invoiceDraft={invoice}
                                modalTrigger={
                                    <Button primary icon={<PencilIcon />}>
                                        Edit Draft
                                    </Button>
                                }
                            />
                        )}
                    </footer>
                </article>
            </main>
        </SidebarLayout>
    )
}
