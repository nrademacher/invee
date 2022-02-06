import { _InvoiceModel, _ItemModel } from 'prisma/zod'
import { z } from 'zod'

export const createInvoiceSchema = _InvoiceModel
    .pick({
        isDraft: true,
        paymentTerms: true,
        projectId: true,
        userCity: true,
        userCountry: true,
        userPostCode: true,
        userStreetAddress: true,
        clientCity: true,
        clientCountry: true,
        clientEmail: true,
        clientName: true,
        clientPostCode: true,
        clientStreetAddress: true,
    })
    .extend({ items: z.array(_ItemModel.pick({ name: true, quantity: true, price: true })) })

export const editInvoiceSchema = createInvoiceSchema.omit({ items: true }).merge(_InvoiceModel.pick({ status: true }))
