import { Chart as ChartJS, ArcElement, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export const InvoiceStatusChart: React.FC<{ invoiceTotal: number; data: number[] }> = ({ invoiceTotal, data }) => (
    <section>
        <h3 className="mb-4 font-heading-narrow text-3xl md:text-4xl">State of your Invoices</h3>
        <div className="flex flex-col-reverse md:flex-row">
            <article className="mx-auto mb-3 flex items-center divide-x divide-neutral-200 md:text-lg">
                <section className="pr-2 text-xl">
                    <span className="font-bold">Total: </span>
                    <span className="font-semibold">{invoiceTotal}</span>
                </section>
                <section className="flex max-w-max space-x-2 divide-x divide-neutral-200">
                    <div className="pl-2">
                        <span className="font-medium">{data[0]} </span>
                        <span className="font-semibold text-blue-600">drafted</span>
                    </div>
                    <div className="pl-2">
                        <span className="font-medium">{data[1]} </span>
                        <span className="font-semibold text-yellow-600">pending</span>
                    </div>
                    <div className="pl-2">
                        <span className="font-medium">{data[2]} </span>
                        <span className="font-semibold text-green-600">paid</span>
                    </div>
                </section>
            </article>
            <div className="mx-auto mb-4 w-1/2 md:mb-0">
                <Doughnut
                    options={{
                        animation: false,
                        responsive: true,
                        plugins: {
                            tooltip: {
                                bodyFont: { family: 'Open Sans' },
                                bodyAlign: 'center',
                                displayColors: false,
                                padding: 8,
                            },
                            legend: {
                                display: false,
                            },
                        },
                    }}
                    data={{
                        labels: ['Draft', 'Pending', 'Paid'],
                        datasets: [
                            {
                                label: 'Invoice statuses',
                                data: data,
                                backgroundColor: ['#2563eb', '#ca8a04', '#16a34a'],
                                borderColor: ['#2563eb', '#ca8a04', '#16a34a'],
                                borderWidth: 1,
                            },
                        ],
                    }}
                />
            </div>
        </div>
    </section>
)
