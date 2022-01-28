import * as z from 'zod'
import { CompleteInvoice, InvoiceModel } from './index'

export const _ItemModel = z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    name: z.string(),
    quantity: z.number().int(),
    price: z.number().int(),
    invoiceId: z.string(),
})

export interface CompleteItem extends z.infer<typeof _ItemModel> {
    invoice: CompleteInvoice
}

/**
 * ItemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const ItemModel: z.ZodSchema<CompleteItem> = z.lazy(() =>
    _ItemModel.extend({
        invoice: InvoiceModel,
    })
)
