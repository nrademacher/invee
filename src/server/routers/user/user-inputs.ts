import { z } from 'zod'
import isStrongPassword from 'validator/lib/isStrongPassword'
import { _UserModel } from 'prisma/zod'

const passwordInput = z.object({
    password: z
        .string()
        .min(8)
        .refine(val => isStrongPassword(val), {
            message:
                'Password must contain at least one of the following characters: lower-case, upper-case, number, symbol',
        }),
})

export const UserInputs = _UserModel
    .pick({ email: true, name: true, streetAddress: true, city: true, postCode: true, country: true, avatarUrl: true })
    .merge(passwordInput)
