import { z } from 'zod'
import isStrongPassword from 'validator/lib/isStrongPassword'

export const createUserSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(8)
        .refine(val => isStrongPassword(val), {
            message:
                'Password must contain at least one of the following characters: lower-case, upper-case, number, symbol',
        }),
    name: z.string().min(3).max(64),
    streedAddress: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    postCode: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
})
