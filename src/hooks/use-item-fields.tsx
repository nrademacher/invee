import { type Control, type FieldValues, useFieldArray, type UseFormRegister, type UseFormWatch } from 'react-hook-form'
import type { Item } from '@prisma/client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { InvoiceFormSection } from '@/components/invoice-form/InvoiceFormSection'
import { Button, InputField } from '@/components'
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/solid'

type UseItemFields = { control: Control; watch: UseFormWatch<FieldValues>; register: UseFormRegister<FieldValues> }

type InvoiceItemInput = Pick<Item, 'name' | 'price' | 'quantity'>

export function useItemFields({ control, watch, register }: UseItemFields) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    })

    const itemValues = fields.map((_, i) => watch(`items.${i}`) as InvoiceItemInput)

    const itemsAreValid: boolean = useMemo(() => {
        if (!fields.length) return false
        if (!itemValues.every(item => Boolean(item.name) && Number(item.price) && Number(item.quantity))) {
            return false
        }
        return true
    }, [fields.length, itemValues])

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
    }, [fields.length])

    const itemFieldsSection = useMemo(
        () => (
            <InvoiceFormSection title="Items">
                {fields.map((field, index) => (
                    <article ref={itemRef} key={field.id} className="grid grid-cols-5 items-baseline gap-4">
                        <div className="col-span-2">
                            <InputField
                                id={`item-${index}-name`}
                                labelText="Item description"
                                {...register(`items.${index}.name`)}
                            />
                        </div>
                        <InputField
                            type="number"
                            min={0.01}
                            step=".01"
                            id={`item-${index}-price`}
                            labelText="Price"
                            {...register(`items.${index}.price`, { valueAsNumber: true })}
                        />
                        <InputField
                            type="number"
                            min={1}
                            id={`item-${index}-quantity`}
                            labelText="Quantity"
                            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        />
                        <Button
                            type="button"
                            className="max-w-max place-self-end text-sm"
                            onClick={() => remove(index)}
                            icon={<TrashIcon />}
                        >
                            Remove
                        </Button>
                    </article>
                ))}
                <Button
                    type="button"
                    primary
                    icon={<PlusCircleIcon />}
                    onClick={() => append({ name: '', price: '', quantity: 1 })}
                >
                    Add Item
                </Button>
                {invoiceTotal ? (
                    <p className="text-right text-xl">
                        Total: <strong>${invoiceTotal}</strong>
                    </p>
                ) : null}
            </InvoiceFormSection>
        ),
        [fields, append, register, remove, invoiceTotal]
    )

    const ItemFieldsSection: React.FC = () => itemFieldsSection

    return { ItemFieldsSection, itemsAreValid, invoiceTotal }
}
