import * as z from "zod"
import { CompleteInvoice, InvoiceModel, CompletePayment, PaymentModel } from "./index"

export const _UserModel = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  streetAddress: z.string().nullish(),
  city: z.string().nullish(),
  postCode: z.string().nullish(),
  country: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof _UserModel> {
  invoicesSent: CompleteInvoice[]
  invoicesReceived: CompleteInvoice[]
  payments: CompletePayment[]
}

/**
 * UserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const UserModel: z.ZodSchema<CompleteUser> = z.lazy(() => _UserModel.extend({
  invoicesSent: InvoiceModel.array(),
  invoicesReceived: InvoiceModel.array(),
  payments: PaymentModel.array(),
}))
