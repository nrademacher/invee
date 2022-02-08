import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createInvoiceSchema } from '@/server/routers/invoice/invoice-inputs'
import { formatPaymentTerms, useControlledSelect, useItemFields, useParam } from '@/lib'
import { trpc } from '@/lib/trpc'
import { cloneElement } from 'react'
import { PaymentTerms } from '@prisma/client'
import { InvoiceFormSection } from './InvoiceFormSection'
import { Button, Checkbox, Dialog, DialogClose, DialogContent, DialogTrigger, InputField, RefLink } from '../lib'
import { PlusIcon, TrashIcon } from '@heroicons/react/solid'

export const CreateNewInvoice: React.FC<{ modalTrigger: React.ReactElement }> = ({ modalTrigger }) => {
    const {
        control,
        register,
        watch,
        handleSubmit,
        reset,
        formState: { isValid },
    } = useForm({ resolver: zodResolver(createInvoiceSchema), mode: 'onBlur' })
    const { itemFields, append, remove, itemsAreValid, invoiceTotal, itemRef } = useItemFields({ control, watch })

    const { pushParam, href, isOn, clearParam } = useParam('new', 'invoice')
    const { invalidateQueries } = trpc.useContext()
    const createInvoice = trpc.useMutation(['invoice.create'], {
        async onSuccess() {
            console.log('SUCCESS')
            clearParam()
            reset()
            await invalidateQueries(['invoice.all'])
        },
    })
    const projectQuery = trpc.useQuery(['project.all'])

    const paymentTermsOptions = Object.values(PaymentTerms).map(terms => {
        return { value: terms, label: formatPaymentTerms(terms) }
    })
    const paymentTermsSelect = useControlledSelect({
        name: 'paymentTerms',
        labelText: 'Payment Terms',
        control,
        options: paymentTermsOptions,
        defaultValue: paymentTermsOptions.find(option => option.value === PaymentTerms.NET_30),
    })
    const projectOptions = projectQuery.data
        ? projectQuery.data.map(project => {
              return { value: project.id, label: project.projectName }
          })
        : []
    const projectSelect = useControlledSelect({
        name: 'projectId',
        labelText: 'Project',
        control,
        options: projectOptions,
        placeholder: 'Add this invoice to a project (optional)',
    })

    const triggerEl = cloneElement(modalTrigger, {
        onClick: async () => {
            await pushParam()
        },
    })

    return (
        <Dialog
            open={isOn}
            onOpenChange={open => {
                if (!open) clearParam()
            }}
        >
            <DialogTrigger asChild>
                <RefLink href={href}>{triggerEl}</RefLink>
            </DialogTrigger>
            <DialogContent onPointerDownOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()}>
                <form
                    onSubmit={handleSubmit(async data => {
                        await createInvoice.mutateAsync({
                            isDraft: data.isDraft,
                            userStreetAddress: data.userStreetAddress,
                            userPostCode: data.userPostCode,
                            userCity: data.userCity,
                            userCountry: data.userCountry,
                            clientName: data.clientName,
                            clientEmail: data.clientEmail,
                            clientStreetAddress: data.clientStreetAddress,
                            clientCity: data.clientCity,
                            clientPostCode: data.clientPostCode,
                            clientCountry: data.clientCountry,
                            paymentTerms: data.paymentTerms,
                            projectId: data.projectId,
                            items: data.items,
                        })
                    })}
                    className="flex flex-col divide-y divide-neutral-300 px-16 py-12"
                >
                    <header className="mb-4 flex items-baseline justify-between">
                        <h1 className="font-heading text-4xl">New Invoice</h1>
                        <Checkbox id="is-draft" labelText="Save as Draft" {...register('isDraft')} />
                    </header>
                    <InvoiceFormSection title="Your Address">
                        <InputField
                            id="user-street-address"
                            labelText="Street Address"
                            {...register('userStreetAddress')}
                        />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <InputField id="user-city" labelText="City" {...register('userCity')} />
                            <InputField id="user-post-code" labelText="Post Code" {...register('userPostCode')} />
                            <InputField id="user-country" labelText="Country" {...register('userCountry')} />
                        </div>
                    </InvoiceFormSection>
                    <InvoiceFormSection title="Client Details">
                        <InputField
                            type="text"
                            id="client-name"
                            labelText="Client's Name"
                            {...register('clientName')}
                        />
                        <InputField
                            type="email"
                            id="client-email"
                            labelText="Client's Email"
                            {...register('clientEmail')}
                        />
                        <InputField
                            id="client-street-address"
                            labelText="Street Address"
                            {...register('clientStreetAddress')}
                        />
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <InputField id="client-city" labelText="City" {...register('clientCity')} />
                            <InputField id="client-post-code" labelText="Post Code" {...register('clientPostCode')} />
                            <InputField id="client-country" labelText="Country" {...register('clientCountry')} />
                        </div>
                    </InvoiceFormSection>
                    <InvoiceFormSection title="Other">
                        {projectSelect && <article>{projectSelect}</article>}
                        <article>{paymentTermsSelect}</article>
                    </InvoiceFormSection>
                    <InvoiceFormSection title="Items">
                        {itemFields.map((field, index) => (
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
                                    min={0}
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
                            icon={<PlusIcon />}
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
                    <div className="flex items-center justify-center gap-4 pt-8">
                        <DialogClose asChild>
                            <Button className="w-1/4">Cancel</Button>
                        </DialogClose>
                        <Button
                            className="w-1/4"
                            primary
                            type="submit"
                            disabled={createInvoice.isLoading || !itemsAreValid || !isValid}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
