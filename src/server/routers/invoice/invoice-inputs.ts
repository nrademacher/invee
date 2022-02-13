import { _InvoiceModel, _ItemModel } from 'prisma/zod'
import { z } from 'zod'

const createItemsSchema = z.object({ items: z.array(_ItemModel.pick({ name: true, quantity: true, price: true })) })
const editItemsSchema = z.object({
    items: z.array(
        _ItemModel.pick({ name: true, quantity: true, price: true }).extend({ id: z.string().cuid().optional() })
    ),
})

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
    .merge(createItemsSchema)

export const editInvoiceSchema = createInvoiceSchema
    .deepPartial()
    .omit({ items: true })
    .merge(editItemsSchema)
    .merge(_InvoiceModel.pick({ status: true }))

export type InvoiceSchemata = typeof createInvoiceSchema | typeof editInvoiceSchema
