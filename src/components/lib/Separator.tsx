import * as SeparatorPrimitive from '@radix-ui/react-separator'
import classNames from 'classnames'

export const Separator: React.FC<SeparatorPrimitive.SeparatorProps> = ({
    asChild,
    orientation,
    decorative,
    className,
}) => (
    <SeparatorPrimitive.Root
        asChild={asChild}
        orientation={orientation}
        decorative={decorative}
        className={classNames(
            'bg-neutral-50',
            orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
            className
        )}
    />
)
