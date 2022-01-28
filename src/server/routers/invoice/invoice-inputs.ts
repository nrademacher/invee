import { _InvoiceModel } from 'prisma/zod'

export const InvoiceInput = _InvoiceModel.pick({
    status: true,
    projectName: true,
    projectDescription: true,
    paymentTerms: true,
    payeeId: true,
})
