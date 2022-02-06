import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js'
import { useRef } from 'react'
import { useDraggable } from '@neodrag/react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { CreateNewInvoice, SidebarLayout } from '@/components'
import { Button } from '@/components/lib'
import { PencilIcon } from '@heroicons/react/solid'
import { Line, Pie } from 'react-chartjs-2'
import faker from '@faker-js/faker'
import { trpc } from '@/lib/trpc'

ChartJS.register(ArcElement, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, Title)

const DashboardItem: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => {
    const draggableRef = useRef(null)
    useDraggable(draggableRef)

    return (
        <article ref={draggableRef} className={`cursor-move rounded-sm border bg-white p-8 ${className}`}>
            {children}
        </article>
    )
}

export default function Dashboard() {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/login')
        },
    })
    const invoicesQuery = trpc.useQuery(['invoice.all'])

    const revenueChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

    if (status === 'loading' || !session) return <div>Loading ...</div>

    return (
        <SidebarLayout pageName="Dashboard" currentUserName={session.user.name as string}>
            <main className="mx-auto h-full w-full p-4 pt-8 lg:p-16 lg:pl-24">
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-12">
                    <DashboardItem className="flex flex-col justify-between lg:col-start-1 lg:col-end-4 lg:row-start-1 lg:row-end-2">
                        <h1 className="font-caption text-4xl font-bold lg:text-5xl">Welcome, {session.user.name} 👋</h1>
                        <div className="flex items-center self-end">
                            <span className="mr-4 text-4xl lg:text-5xl">👉</span>
                            <CreateNewInvoice
                                modalTrigger={
                                    <Button primary icon={<PencilIcon />}>
                                        New Invoice
                                    </Button>
                                }
                            />
                        </div>
                    </DashboardItem>
                    {invoicesQuery.data && (
                        <DashboardItem className="lg:col-start-1 lg:col-end-4 lg:row-start-2 lg:row-end-4">
                            <h3 className="mb-3 font-heading-narrow text-3xl">State of your invoices</h3>
                            <Pie
                                options={{
                                    plugins: {
                                        tooltip: {
                                            bodyFont: { family: 'Open Sans' },
                                            bodyAlign: 'center',
                                            displayColors: false,
                                            padding: 8,
                                        },
                                        legend: {
                                            labels: {
                                                // This more specific font property overrides the global property
                                                font: {
                                                    size: 12,
                                                    family: 'Open Sans',
                                                },
                                            },
                                        },
                                    },
                                }}
                                data={{
                                    labels: ['Draft', 'Pending', 'Paid'],
                                    datasets: [
                                        {
                                            label: 'Invoice statuses',
                                            data: [
                                                invoicesQuery.data.filter(inv => inv.isDraft).length,
                                                invoicesQuery.data.filter(
                                                    inv => !inv.isDraft && inv.status === 'PENDING'
                                                ).length,
                                                invoicesQuery.data.filter(inv => !inv.isDraft && inv.status === 'PAID')
                                                    .length,
                                            ],
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.2)',
                                                'rgba(54, 162, 235, 0.2)',
                                                'rgba(255, 206, 86, 0.2)',
                                            ],
                                            borderColor: [
                                                'rgba(255, 99, 132, 1)',
                                                'rgba(54, 162, 235, 1)',
                                                'rgba(255, 206, 86, 1)',
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                        </DashboardItem>
                    )}
                    <DashboardItem className="lg:col-start-4 lg:col-end-13 lg:row-start-1 lg:row-end-4">
                        <h3 className="font-heading-narrow text-3xl">Revenue</h3>
                        <Line
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                    title: {
                                        display: true,
                                    },
                                },
                            }}
                            data={{
                                labels: revenueChartLabels,
                                datasets: [
                                    {
                                        label: 'Revenue',
                                        data: revenueChartLabels.map(() =>
                                            faker.datatype.number({ min: 0, max: 1000 })
                                        ),
                                        borderColor: 'rgb(255, 99, 132)',
                                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                    },
                                ],
                            }}
                        />
                    </DashboardItem>
                </div>
            </main>
        </SidebarLayout>
    )
}
