import * as z from "zod"
import { InvoiceStatus, PaymentTerms } from "@prisma/client"
import { CompletePayment, PaymentModel, CompleteItem, ItemModel, CompleteUser, UserModel, CompleteProject, ProjectModel } from "./index"

export const _InvoiceModel = z.object({
  id: z.string(),
  publicId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.nativeEnum(InvoiceStatus),
  projectName: z.string(),
  projectDescription: z.string().nullish(),
  paymentTerms: z.nativeEnum(PaymentTerms),
  payeeId: z.string(),
  senderId: z.string(),
  projectId: z.string().nullish(),
})

export interface CompleteInvoice extends z.infer<typeof _InvoiceModel> {
  payments: CompletePayment[]
  items: CompleteItem[]
  payee: CompleteUser
  sender: CompleteUser
  project?: CompleteProject | null
}

/**
 * InvoiceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const InvoiceModel: z.ZodSchema<CompleteInvoice> = z.lazy(() => _InvoiceModel.extend({
  payments: PaymentModel.array(),
  items: ItemModel.array(),
  payee: UserModel,
  sender: UserModel,
  project: ProjectModel.nullish(),
}))
