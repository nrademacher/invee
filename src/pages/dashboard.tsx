import { useSessionGuard } from '@/hooks'
import { trpc } from '@/lib/trpc'
import { useMemo } from 'react'
import { Button, CreateNewInvoice, SidebarLayout, InvoiceStatusChart, RevenueChart } from '@/components'
import { PencilIcon } from '@heroicons/react/solid'

export default function Dashboard() {
    const { session, status } = useSessionGuard()
    const { data } = trpc.useQuery(['invoice.all'])

    const invoices = useMemo(() => {
        if (!data) return []
        return data
    }, [data])

    const revenueChartLabels = useMemo(() => {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]
        const currentMonth = new Date().getMonth()
        const monthsOfCurrentYear = months.slice(0, currentMonth + 1)
        return monthsOfCurrentYear
    }, [])

    const invoicesChartData = useMemo(
        () => [
            invoices.filter(inv => inv.isDraft).length,
            invoices.filter(inv => !inv.isDraft && inv.status === 'PENDING').length,
            invoices.filter(inv => !inv.isDraft && inv.status === 'PAID').length,
        ],
        [invoices]
    )

    const receivedRevenueChartData = useMemo(
        () =>
            revenueChartLabels.map((_, idx) => {
                const paidInvoicesFromMonth = invoices?.filter(
                    inv => new Date(inv.createdAt).getMonth() === idx && inv.status === 'PAID'
                )
                const revenueFromMonth = paidInvoicesFromMonth?.reduce((total, inv) => total + inv.total, 0)
                return revenueFromMonth || 0
            }),
        [invoices, revenueChartLabels]
    )

    const expectedRevenueChartData = useMemo(
        () =>
            revenueChartLabels.map((_, idx) => {
                const paidInvoicesFromMonth = invoices?.filter(
                    inv => new Date(inv.createdAt).getMonth() === idx && !inv.isDraft && inv.status === 'PENDING'
                )
                const revenueFromMonth = paidInvoicesFromMonth?.reduce((total, inv) => total + inv.total, 0)
                return revenueFromMonth || 0
            }),
        [invoices, revenueChartLabels]
    )

    if (status === 'loading' || !session || !invoices) return <div>Loading ...</div>

    return (
        <SidebarLayout pageName="Dashboard" currentUserName={session.user.name as string}>
            <main className="mx-2 mt-4 grid place-items-center lg:mx-0 lg:mt-0 lg:h-full">
                <article className="w-full divide-y divide-neutral-300 rounded-sm border border-neutral-200 bg-white p-6 sm:max-w-screen-sm md:max-w-screen-md md:p-12 lg:mt-0 lg:max-w-screen-lg">
                    <header className="flex flex-col items-center justify-between pb-6 md:flex-row">
                        <h1 className="mb-6 font-caption text-5xl font-bold md:mb-0">
                            Welcome, {session.user.name as string} 👋
                        </h1>
                        <CreateNewInvoice
                            modalTrigger={
                                <Button primary icon={<PencilIcon />}>
                                    New Invoice
                                </Button>
                            }
                        />
                    </header>
                    <div className="space-y-8 divide-y divide-neutral-200 py-6">
                        <InvoiceStatusChart data={invoicesChartData} invoiceTotal={invoices.length} />
                        <RevenueChart
                            expectedRevenueData={expectedRevenueChartData}
                            receivedRevenueData={receivedRevenueChartData}
                            revenueLabels={revenueChartLabels}
                        />
                    </div>
                </article>
            </main>
        </SidebarLayout>
    )
}
