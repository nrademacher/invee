import type { Invoice, Item } from '@prisma/client'

export type InvoiceWithItems = Invoice & { items: Item[] }
