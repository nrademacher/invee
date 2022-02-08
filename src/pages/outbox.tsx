import { useSessionGuard } from '@/lib'
import { trpc } from '@/lib/trpc'
import { Button, CreateNewInvoice, SidebarLayout } from '@/components'
import dayjs from 'dayjs'
import { PencilIcon } from '@heroicons/react/solid'
import { InvoiceStatus } from '@prisma/client'
import classNames from 'classnames'

const InvoiceStatusLabel: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
    return (
        <span
            className={classNames(
                'grid w-1/12 place-items-center rounded border py-4 text-sm font-medium lg:text-base',
                status === InvoiceStatus.PENDING && 'border-yellow-300 bg-yellow-100 text-yellow-600',
                status === InvoiceStatus.PAID && 'border-green-300 bg-green-100 text-green-600'
            )}
        >
            {status[0] + status.slice(1).toLowerCase()}
        </span>
    )
}

const InvoiceListing: React.FC<{
    id: number
    date: Date
    clientName: string
    total: number
    status: InvoiceStatus
}> = ({ id, date, clientName, total, status }) => (
    <article className="flex w-full items-center justify-between border border-neutral-200 bg-white px-8 py-4">
        <span className="w-2/12 justify-self-end font-semibold">#{id}</span>
        <span className="w-3/12">{dayjs(date).toISOString().split('T')[0].replaceAll('-', '/')}</span>
        <span className="w-4/12 justify-self-start font-medium">{clientName}</span>
        <span className="w-2/12 font-bold">${total}</span>
        <InvoiceStatusLabel status={status} />
    </article>
)

export default function Outbox() {
    const { session, status } = useSessionGuard()

    const invoicesQuery = trpc.useQuery(['invoice.all'])

    if (status === 'loading' || !session || !invoicesQuery.data) return <div>Loading ...</div>

    return (
        <SidebarLayout pageName="Outbox" currentUserName={session.user.name as string}>
            <main className="flex w-full flex-col items-center space-y-3 py-2 lg:px-24 lg:py-16">
                <header className="mb-2 mt-3 flex w-full items-center justify-between pl-2 lg:mt-0 lg:mb-4 lg:pl-0">
                    <div>
                        <h1 className="mb-2 font-heading text-3xl lg:mb-4 lg:text-5xl">Your Outbox 📮</h1>
                        <h2 className="font-heading-narrow text-lg text-neutral-400 lg:text-lg">
                            Overview of your non-draft invoices
                        </h2>
                    </div>
                    <div className="hidden lg:inline-block">
                        <CreateNewInvoice
                            modalTrigger={
                                <Button primary icon={<PencilIcon />}>
                                    New Invoice
                                </Button>
                            }
                        />
                    </div>
                </header>
                <section className="w-full space-y-1 px-2 text-xs md:text-sm lg:space-y-2 lg:px-0 lg:text-base">
                    {invoicesQuery.data
                        .filter(inv => !inv.isDraft)
                        .map(inv => (
                            <InvoiceListing
                                key={inv.publicId}
                                id={inv.id}
                                date={inv.createdAt}
                                clientName={inv.clientName}
                                total={inv.total}
                                status={inv.status}
                            />
                        ))}
                </section>
            </main>
        </SidebarLayout>
    )
}
