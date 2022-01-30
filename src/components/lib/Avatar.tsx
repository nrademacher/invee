import * as AvatarPrimitive from '@radix-ui/react-avatar'
import classNames from 'classnames'

function getFallbackInitials(name: string): string {
    if (!name.length) return ''
    const nameTokens = name.split(' ')
    let initials: string
    if (nameTokens.length === 1) {
        initials = nameTokens[0][0].toUpperCase()
    } else if (nameTokens.length === 2) {
        initials = nameTokens[0][0].toUpperCase() + nameTokens[1][0].toUpperCase()
    } else {
        initials = nameTokens[0][0].toLocaleUpperCase() + nameTokens[nameTokens.length - 1][0].toUpperCase()
    }
    return initials
}

interface IAvatar {
    imageUrl: string
    userName: string
    className?: string
}

export const Avatar: React.FC<IAvatar> = ({ imageUrl, userName, className }) => {
    const initials = getFallbackInitials(userName)

    return (
        <AvatarPrimitive.Root
            className={classNames(
                `inline-flex select-none items-center justify-center overflow-hidden rounded-full bg-gray-900 align-middle`,
                className
            )}
        >
            <AvatarPrimitive.Image className="h-full w-full rounded-[inherit] object-cover" src={imageUrl} />
            <AvatarPrimitive.Fallback
                delayMs={600}
                className="text-[15px,1] flex h-full w-full items-center justify-center bg-gray-900 font-medium leading-[1] text-gray-50"
            >
                {initials}
            </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
    )
}
