import { Avatar, Separator } from '@/components'
import { useSessionGuard } from '@/lib'
import { trpc } from '@/lib/trpc'
import { AdjustmentsIcon, DotsVerticalIcon, InboxIcon, PencilIcon, ViewBoardsIcon } from '@heroicons/react/outline'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    PointElement,
    LineElement,
} from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'

import faker from '@faker-js/faker'

ChartJS.register(ArcElement, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, BarElement, Title)

export default function Dashboard() {
    const { data: session, status } = useSessionGuard()
    const invoicesQuery = trpc.useQuery(['invoice.all'])

    const revenueChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']

    if (status === 'loading' || !session || !invoicesQuery.data) return <div>Loading ...</div>

    return (
        <main className="flex h-full">
            <section className="flex flex-col justify-between border-r border-neutral-200 bg-neutral-900 p-6 pb-12 text-neutral-400 lg:w-max">
                <article>
                    <header className="mb-16 hidden h-max items-center space-x-6 lg:flex">
                        <h1 className="font-heading text-3xl font-bold leading-[2] text-neutral-100">inv</h1>
                        <Separator orientation="vertical" decorative className="h-12 bg-neutral-600" />
                        <h2 className="text-lg text-neutral-500">Dashboard</h2>
                    </header>
                    <div>
                        <h2 className="mb-4 font-caption text-sm uppercase text-neutral-600">Overview</h2>
                        <nav className="flex h-full flex-col space-y-5 font-medium">
                            <a className="flex cursor-pointer items-center">
                                <ViewBoardsIcon className="mr-3 h-5 w-5 text-neutral-500" />
                                <span className="hidden transition-colors hover:text-neutral-300 lg:inline">
                                    Projects
                                </span>
                            </a>
                            <a className="flex cursor-pointer items-center">
                                <InboxIcon className="mr-3 h-5 w-5 text-neutral-500" />
                                <span className="hidden transition-colors hover:text-neutral-300 lg:inline">
                                    Outbox
                                </span>
                            </a>
                            <a className="flex cursor-pointer items-center">
                                <AdjustmentsIcon className="mr-3 h-5 w-5 text-neutral-500" />
                                <span className="hidden transition-colors hover:text-neutral-300 lg:inline">
                                    Settings
                                </span>
                            </a>
                        </nav>
                    </div>
                </article>
                <article>
                    <Separator orientation="horizontal" decorative className="mx-auto mb-6 w-2/3 bg-neutral-600" />
                    <div className="flex items-center text-neutral-200">
                        <Avatar
                            imageUrl="https://i.pravatar.cc/150?img=68"
                            userName={session.user.name as string}
                            className="mr-3 h-10 w-10 border-2 border-neutral-50"
                        />
                        <span className="mr-4 font-medium">{session.user.name}</span>{' '}
                        <a>
                            <DotsVerticalIcon className="h-5 w-5 text-neutral-400" />
                        </a>
                    </div>
                </article>
            </section>
            <section className="w-full p-16">
                <header className="mb-20 flex items-start justify-between">
                    <h2 className="font-caption text-5xl font-bold">Welcome, {session.user.name}</h2>
                    <button
                        className="top-16 right-16 flex items-center rounded-sm bg-neutral-900 py-3 px-5 font-semibold text-neutral-50 hover:bg-neutral-600"
                        type="submit"
                    >
                        <PencilIcon className="mr-3 h-5 w-5" />
                        <span>New Invoice</span>
                    </button>
                </header>
                <div className="container flex gap-3">
                    <div className="h-max w-1/4 rounded-sm border bg-white p-6 shadow-sm">
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
                                            invoicesQuery.data.filter(inv => inv.status === 'DRAFT').length,
                                            invoicesQuery.data.filter(inv => inv.status === 'PENDING').length,
                                            invoicesQuery.data.filter(inv => inv.status === 'PAID').length,
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
                    </div>
                    <div className="h-max w-3/4 rounded-sm border bg-white p-6 shadow-sm">
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
                    </div>
                </div>
            </section>
        </main>
    )
}
