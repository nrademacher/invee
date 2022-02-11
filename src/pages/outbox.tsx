import { useSessionGuard } from '@/hooks'
import { trpc } from '@/lib/trpc'
import { Button, CreateNewInvoice, SidebarLayout, InvoiceListing } from '@/components'
import { PencilIcon } from '@heroicons/react/solid'

export default function Outbox() {
    const { session, status } = useSessionGuard()
    const invoicesQuery = trpc.useQuery(['invoice.all'])

    if (status === 'loading' || !session || !invoicesQuery.data) return <div>Loading ...</div>

    return (
        <SidebarLayout pageName="Outbox" currentUserName={session.user.name as string}>
            <main className="flex w-full flex-col items-center space-y-3 py-2 lg:px-24 lg:py-16">
                <header className="mb-2 mt-3 flex w-full items-center justify-between pl-2 lg:mt-0 lg:mb-4 lg:pl-0">
                    <div>
                        <h1 className="mb-2 font-heading text-3xl lg:text-5xl">Your Outbox 📮</h1>
                        <h2 className="font-caption text-lg text-neutral-400 lg:text-lg">
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
                <section className="grid w-full gap-2 px-2 text-xs md:text-sm lg:px-0 lg:text-base">
                    {invoicesQuery.data.map(inv => (
                        <InvoiceListing
                            key={inv.publicId}
                            id={inv.id}
                            date={inv.createdAt}
                            clientName={inv.clientName}
                            total={inv.total}
                            isDraft={inv.isDraft}
                            status={inv.status}
                        />
                    ))}
                </section>
            </main>
        </SidebarLayout>
    )
}
