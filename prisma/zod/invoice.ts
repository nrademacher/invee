import * as z from "zod"
import { InvoiceStatus, PaymentTerms } from "@prisma/client"
import { CompleteItem, ItemModel, CompleteUser, UserModel, CompleteProject, ProjectModel } from "./index"

export const _InvoiceModel = z.object({
  id: z.number().int(),
  publicId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isDraft: z.boolean().optional(),
  status: z.nativeEnum(InvoiceStatus).optional(),
  paymentTerms: z.nativeEnum(PaymentTerms).optional(),
  userId: z.string(),
  projectId: z.string().nullish(),
  total: z.number(),
  userStreetAddress: z.string().min(1),
  userCity: z.string().min(1),
  userPostCode: z.string().min(1),
  userCountry: z.string().min(1),
  clientEmail: z.string().email(),
  clientName: z.string().min(1),
  clientStreetAddress: z.string().min(1),
  clientCity: z.string().min(1),
  clientPostCode: z.string().min(1),
  clientCountry: z.string().min(1),
})

export interface CompleteInvoice extends z.infer<typeof _InvoiceModel> {
  items: CompleteItem[]
  user: CompleteUser
  project?: CompleteProject | null
}

/**
 * InvoiceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const InvoiceModel: z.ZodSchema<CompleteInvoice> = z.lazy(() => _InvoiceModel.extend({
  items: ItemModel.array(),
  user: UserModel,
  project: ProjectModel.nullish(),
}))
