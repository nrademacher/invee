import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, Title)

export const RevenueChart: React.FC<{
    expectedRevenueData: number[]
    receivedRevenueData: number[]
    revenueLabels: string[]
}> = ({ expectedRevenueData, receivedRevenueData, revenueLabels }) => (
    <section className="">
        <h3 className="pt-4 pb-8 font-heading-narrow text-3xl md:text-4xl">Revenue this Year</h3>
        <section className="mx-auto flex max-w-max space-x-3 divide-x divide-neutral-200 md:text-lg">
            <div className="">
                <span className="font-semibold">${expectedRevenueData[new Date().getMonth()]} </span>
                <span className="font-semibold text-yellow-600">pending</span>
            </div>
            <div className="pl-3">
                <span className="font-semibold">${receivedRevenueData[new Date().getMonth()]} </span>
                <span className="font-semibold text-green-600">received</span>
            </div>
        </section>
        <Line
            options={{
                animation: false,
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
                labels: revenueLabels,
                datasets: [
                    {
                        data: receivedRevenueData,
                        borderColor: '#16a34a',
                        backgroundColor: '#16a43a',
                    },
                    {
                        data: expectedRevenueData,
                        borderColor: '#ca8a04',
                        backgroundColor: '#ca8a04',
                    },
                ],
            }}
        />
    </section>
)
