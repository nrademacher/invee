import type { InvoiceWithItems } from './types'
import { useParam } from '@/hooks'
import { trpc } from '@/lib/trpc'
import type { FieldValues } from 'react-hook-form'
import { InvoiceForm } from './InvoiceForm'
import { editInvoiceSchema } from '@/server/routers/invoice/invoice-inputs'

interface IEditInvoiceDraft {
    modalTrigger: React.ReactElement
    invoiceDraft: InvoiceWithItems
}

export const EditInvoiceDraft: React.FC<IEditInvoiceDraft> = ({ modalTrigger, invoiceDraft }) => {
    const { pushParam, href, isOn, clearParam } = useParam('edit', String(invoiceDraft.id))

    const { refetch } = trpc.useQuery(['invoice.byId', { id: invoiceDraft.id }])
    const editInvoice = trpc.useMutation(['invoice.edit'], {
        async onSuccess() {
            await refetch()
            clearParam()
        },
    })

    async function editDraft(data: FieldValues) {
        await editInvoice.mutateAsync({
            id: invoiceDraft.id,
            data: {
                userStreetAddress: data.userStreetAddress,
                userPostCode: data.userPostCode,
                userCity: data.userCity,
                userCountry: data.userCountry,
                clientName: data.clientName,
                clientEmail: data.clientEmail,
                clientStreetAddress: data.clientStreetAddress,
                clientCity: data.clientCity,
                clientPostCode: data.clientPostCode,
                clientCountry: data.clientCountry,
                paymentTerms: data.paymentTerms,
                projectId: data.projectId,
                items: data.items,
            },
        })
    }

    return (
        <InvoiceForm
            href={href}
            isDraft={true}
            invoiceDraft={invoiceDraft}
            schema={editInvoiceSchema}
            onModalChange={clearParam}
            modalOpen={isOn}
            modalTrigger={modalTrigger}
            triggerAction={pushParam}
            submitAction={editDraft}
        />
    )
}
