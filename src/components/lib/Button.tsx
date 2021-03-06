import { forwardRef } from 'react'
import classNames from 'classnames'

type ButtonProps = {
    children: React.ReactText
    primary?: boolean
    danger?: boolean
    icon?: JSX.Element
} & JSX.IntrinsicElements['button']

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ primary, danger, icon, children, className, ...props }: ButtonProps, forwardedRef) => (
        <button
            ref={forwardedRef}
            {...props}
            className={classNames(
                'rounded-sm border py-3 px-5 font-semibold transition-colors',
                primary && 'bg-neutral-900 text-neutral-50 hover:bg-neutral-600',
                danger && 'bg-red-900 text-neutral-50 hover:bg-red-600',
                icon && 'flex items-center',
                props.disabled && 'border-neutral-100 bg-neutral-100 text-gray-300 hover:bg-neutral-100',
                className
            )}
        >
            {icon && <span className="mr-3 h-5 w-5">{icon}</span>}
            <span>{children}</span>
        </button>
    )
)
Button.displayName = 'Button'
