import classNames from 'classnames'
import { forwardRef } from 'react'

type ButtonProps = {
    primary?: boolean
    icon?: JSX.Element
    children: React.ReactText
} & JSX.IntrinsicElements['button']

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ primary, icon, children, className, ...props }: ButtonProps, forwardRef) => (
        <button
            ref={forwardRef}
            {...props}
            className={classNames(
                'rounded-sm border py-3 px-5 font-semibold',
                primary && 'bg-neutral-900 text-neutral-50 hover:bg-neutral-600',
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
