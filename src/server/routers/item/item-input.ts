import { _ItemModel } from 'prisma/zod'

export const createItemSchema = _ItemModel.pick({
    name: true,
    quantity: true,
    price: true,
    invoiceId: true,
})

export const editItemSchema = createItemSchema
