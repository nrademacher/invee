import type { UrlObject } from 'url'
import type { InvoiceSchemata } from '@/server/routers/invoice/invoice-inputs'
import type { InvoiceWithItems } from './types'
import { type FieldValues, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useItemFields } from '@/hooks'
import { trpc } from '@/lib/trpc'
import { PaymentTerms } from '@prisma/client'
import { formatPaymentTerms } from '@/lib'
import { cloneElement, useEffect } from 'react'
import { InvoiceFormSection } from './InvoiceFormSection'
import { Button, Checkbox, Dialog, DialogClose, DialogContent, DialogTrigger, InputField, RefLink } from '../lib'
import { ControlledSelect } from './ControlledSelect'

interface IInvoiceForm {
    href: UrlObject
    isDraft: boolean
    schema: InvoiceSchemata
    invoiceDraft?: InvoiceWithItems
    modalOpen: boolean
    modalTrigger: React.ReactElement
    onModalChange: (() => void) | (() => Promise<void>)
    triggerAction: (() => void) | (() => Promise<void>)
    submitAction: (data: FieldValues) => Promise<void>
}

export const InvoiceForm: React.FC<IInvoiceForm> = ({
    modalTrigger,
    triggerAction,
    submitAction,
    onModalChange,
    modalOpen,
    href,
    isDraft,
    invoiceDraft,
    schema,
}) => {
    const {
        control,
        register,
        watch,
        setValue,
        handleSubmit,
        reset,
        formState: { isValid, isSubmitSuccessful },
    } = useForm({ resolver: zodResolver(schema), mode: 'onBlur' })
    const { ItemFieldsSection, itemsAreValid } = useItemFields({ control, watch, register })

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
        }
    }, [isSubmitSuccessful, reset])

    useEffect(() => {
        if (isDraft && invoiceDraft) {
            for (const draftField in invoiceDraft) {
                setValue(draftField, invoiceDraft[draftField as keyof InvoiceWithItems])
            }
        }
    }, [modalOpen, isDraft, invoiceDraft, setValue])

    const paymentTermsOptions = Object.values(PaymentTerms).map(terms => {
        return { value: terms, label: formatPaymentTerms(terms) }
    })

    const projectQuery = trpc.useQuery(['project.all'])
    const projectOptions = projectQuery.data
        ? projectQuery.data.map(project => {
              return { value: project.id, label: project.projectName }
          })
        : []

    const triggerEl = cloneElement(modalTrigger, {
        onClick: async () => {
            await triggerAction()
        },
    })

    return (
        <Dialog
            open={modalOpen}
            onOpenChange={open => {
                if (!open) {
                    onModalChange()
                    reset()
                }
            }}
        >
            <DialogTrigger asChild>
                <RefLink href={href}>{triggerEl}</RefLink>
            </DialogTrigger>
            <DialogContent onPointerDownOutside={e => e.preventDefault()} onEscapeKeyDown={e => e.preventDefault()}>
                <form
                    onSubmit={handleSubmit(submitAction)}
                    className="flex flex-col divide-y divide-neutral-300 px-8 py-6 md:px-16 md:py-12"
                >
                    <header className="mb-4 flex items-end justify-between">
                        <h1 className="font-heading text-4xl">{isDraft ? 'Edit Draft' : 'New Invoice'}</h1>
                        {!isDraft && <Checkbox id="is-draft" labelText="Save as Draft" {...register('isDraft')} />}
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
                        <ControlledSelect
                            name="projectId"
                            labelText="Project"
                            control={control}
                            options={projectOptions}
                            placeholder="Add this invoice to a project (optional)"
                        />
                        <ControlledSelect
                            name="paymentTerms"
                            labelText="Payment Terms"
                            control={control}
                            options={paymentTermsOptions}
                            defaultValue={paymentTermsOptions.find(option => option.value === PaymentTerms.NET_30)}
                        />
                    </InvoiceFormSection>
                    <ItemFieldsSection />
                    <div className="flex flex-col items-center justify-center gap-4 pt-8 md:flex-row">
                        <DialogClose asChild>
                            <Button className="w-full md:w-1/4">Cancel</Button>
                        </DialogClose>
                        <Button className="w-full md:w-1/4" primary type="submit" disabled={!itemsAreValid || !isValid}>
                            {isDraft ? 'Save' : 'Create'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
