import type { Item } from '@prisma/client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Control, FieldValues, useFieldArray, UseFormWatch } from 'react-hook-form'

type UseItemFields = { control: Control; watch: UseFormWatch<FieldValues> }

type InvoiceItemInput = Pick<Item, 'name' | 'price' | 'quantity'>

export function useItemFields({ control, watch }: UseItemFields) {
    const {
        fields: itemFields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: 'items',
    })

    const itemValues = itemFields.map((_, i) => watch(`items.${i}`) as InvoiceItemInput)

    const itemsAreValid: boolean = useMemo(() => {
        if (!itemFields.length) return false
        if (!itemValues.every(item => Boolean(item.name) && Number(item.price) && Number(item.quantity))) {
            return false
        }
        return true
    }, [itemFields.length, itemValues])

    const memoizedTotal: number = useMemo(() => itemValues.reduce((t, i) => t + i.price * i.quantity, 0), [itemValues])
    const [invoiceTotal, setInvoiceTotal] = useState(0)
    useEffect(() => {
        if (!isNaN(Number(memoizedTotal))) {
            setInvoiceTotal(memoizedTotal)
        }
    }, [memoizedTotal])

    const itemRef = useRef<HTMLElement>(null)
    useEffect(() => {
        if (itemRef.current) {
            itemRef.current.scrollIntoView()
        }
    }, [itemFields.length])

    return { itemFields, append, remove, itemsAreValid, invoiceTotal, itemRef }
}
