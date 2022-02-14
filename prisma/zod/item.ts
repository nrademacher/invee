import * as z from "zod"
import { CompleteInvoice, InvoiceModel } from "./index"

export const _ItemModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string().min(1),
  quantity: z.number().int().optional(),
  price: z.number(),
  invoiceId: z.number().int(),
})

export interface CompleteItem extends z.infer<typeof _ItemModel> {
  invoice: CompleteInvoice
}

/**
 * ItemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const ItemModel: z.ZodSchema<CompleteItem> = z.lazy(() => _ItemModel.extend({
  invoice: InvoiceModel,
}))
