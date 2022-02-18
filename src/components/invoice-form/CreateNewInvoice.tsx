import { useParam } from '@/hooks'
import { useTRPCContext, useTRPCMutation } from '@/lib/trpc'
import { createInvoiceSchema } from '@/server/routers/invoice/invoice-inputs'
import type { FieldValues } from 'react-hook-form'
import { InvoiceForm } from './InvoiceForm'

export const CreateNewInvoice: React.FC<{ modalTrigger: React.ReactElement }> = ({ modalTrigger }) => {
    const { pushParam, href, isOn, clearParam } = useParam('new', 'invoice')

    const { invalidateQueries } = useTRPCContext()
    const createInvoice = useTRPCMutation(['invoice.create'], {
        async onSuccess() {
            clearParam()
            await invalidateQueries(['invoice.all'])
        },
    })

    async function createNewInvoice(data: FieldValues) {
        await createInvoice.mutateAsync({
            isDraft: data.isDraft,
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
        })
    }

    return (
        <InvoiceForm
            href={href}
            isDraft={false}
            schema={createInvoiceSchema}
            onModalChange={clearParam}
            modalOpen={isOn}
            modalTrigger={modalTrigger}
            triggerAction={pushParam}
            submitAction={createNewInvoice}
        />
    )
}
