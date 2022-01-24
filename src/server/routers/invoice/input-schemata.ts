import { InvoiceStatus, PaymentTerms } from '@prisma/client'
import { z } from 'zod'

export const createInvoiceSchema = z.object({
    projectName: z.string().min(3),
    projectDescription: z.string().nullish(),
    status: z.nativeEnum(InvoiceStatus).nullish(),
    paymentTerms: z.nativeEnum(PaymentTerms).nullish(),
    payeeId: z.string().cuid().nullish(),
})
