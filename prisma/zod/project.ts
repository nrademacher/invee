import * as z from 'zod'
import { CompleteUser, UserModel, CompleteInvoice, InvoiceModel } from './index'

export const _ProjectModel = z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string(),
    projectName: z.string(),
    projectDescription: z.string().nullish(),
})

export interface CompleteProject extends z.infer<typeof _ProjectModel> {
    user: CompleteUser
    invoices: CompleteInvoice[]
}

/**
 * ProjectModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const ProjectModel: z.ZodSchema<CompleteProject> = z.lazy(() =>
    _ProjectModel.extend({
        user: UserModel,
        invoices: InvoiceModel.array(),
    })
)
