import { InvoiceStatus } from '@prisma/client'
import classNames from 'classnames'
import { RefLink } from '..'
import { CalendarIcon, CashIcon, HashtagIcon, UserIcon } from '@heroicons/react/solid'

const InvoiceStatusLabel: React.FC<{ status: InvoiceStatus; isDraft: boolean }> = ({ status, isDraft }) => {
    return (
        <span
            className={classNames(
                'grid w-3/12 place-items-center rounded border py-3 text-xs font-semibold md:text-base lg:w-1/12',
                !isDraft && status === InvoiceStatus.PENDING && 'border-yellow-300 bg-yellow-100 text-yellow-600',
                status === InvoiceStatus.PAID && 'border-green-300 bg-green-100 text-green-600',
                isDraft && 'border-blue-300 bg-blue-100 text-blue-600'
            )}
        >
            {isDraft ? 'Draft' : status[0] + status.slice(1).toLowerCase()}
        </span>
    )
}

export const InvoiceListing: React.FC<{
    id: number
    date: Date
    clientName: string
    total: number
    status: InvoiceStatus
    isDraft: boolean
}> = ({ id, date, clientName, total, status, isDraft }) => (
    <RefLink href={`/invoices/${id}`}>
        <article className="flex w-full transform cursor-pointer items-center justify-between border border-neutral-200 bg-white px-8 py-4 transition-all hover:scale-105 hover:shadow">
            <span className="flex w-2/12 items-center text-lg font-semibold md:text-xl">
                <HashtagIcon className="mr-1 h-5 w-5 text-neutral-400 md:h-6 md:w-6" />
                {id}
            </span>
            <span className="hidden w-3/12 lg:flex">
                <CalendarIcon className="mr-4 h-5 w-5 text-neutral-300 md:h-6 md:w-6" />
                {date.toLocaleDateString()}
            </span>
            <span className="flex w-6/12 items-center justify-center font-medium md:justify-start lg:w-4/12">
                <UserIcon className="mr-4 h-5 w-5 text-neutral-300 md:h-6 md:w-6" /> {clientName}
            </span>
            <span className="mr-4 flex w-2/12 items-center text-base font-bold md:text-lg lg:mr-0">
                <CashIcon className="mr-4 h-5 w-5 text-neutral-300 md:h-6 md:w-6" /> ${total}
            </span>
            <InvoiceStatusLabel status={status} isDraft={isDraft} />
        </article>
    </RefLink>
)
