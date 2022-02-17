import { forwardRef } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

type LabelProps = LabelPrimitive.LabelProps & { children: React.ReactText }

export const Label: React.FC<LabelProps> = ({ children, ...props }) => (
    <LabelPrimitive.Root {...props} className={`mb-2 select-none text-sm font-medium ${props.className}`}>
        {children}
    </LabelPrimitive.Root>
)

type InputProps = JSX.IntrinsicElements['input'] & { labelText: React.ReactText }

export const InputField = forwardRef<HTMLInputElement, InputProps>(({ labelText, ...props }, forwardedRef) => (
    <div className="flex w-full flex-col">
        <Label htmlFor={props.id}>{labelText}</Label>
        <input
            ref={forwardedRef}
            type={props.type || 'text'}
            value={props.value}
            {...props}
            className={`mt-0 rounded-sm border border-neutral-300 ${props.className}`}
        />
    </div>
))
InputField.displayName = 'InputField'

export const Checkbox = forwardRef<HTMLInputElement, InputProps>(({ labelText, ...props }, forwardedRef) => (
    <div className="flex">
        <Label className="mr-2 text-xs md:text-sm" htmlFor={props.id}>
            {labelText}
        </Label>
        <input
            ref={forwardedRef}
            type="checkbox"
            value={props.value}
            {...props}
            className="h-5 w-5 rounded-sm border-neutral-300 text-neutral-600 focus:ring-neutral-500"
        />
    </div>
))
Checkbox.displayName = 'Checkbox'
