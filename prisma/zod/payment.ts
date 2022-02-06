import { CompleteInvoice, CompleteUser, InvoiceModel, UserModel } from './index'
import { PaymentType } from '@prisma/client'
import * as z from 'zod'

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const _PaymentModel = z.object({
    id: z.string(),
    publicId: z.string(),
    type: z.nativeEnum(PaymentType),
    invoiceId: z.string(),
    userId: z.string(),
    amount: z.number().int(),
    fee: z.number().int(),
    currency: z.string(),
    success: z.boolean(),
    refunded: z.boolean(),
    data: jsonSchema,
    externalId: z.string(),
})

export interface CompletePayment extends z.infer<typeof _PaymentModel> {
    invoice: CompleteInvoice
    user: CompleteUser
}

/**
 * PaymentModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const PaymentModel: z.ZodSchema<CompletePayment> = z.lazy(() =>
    _PaymentModel.extend({
        invoice: InvoiceModel,
        user: UserModel,
    })
)
