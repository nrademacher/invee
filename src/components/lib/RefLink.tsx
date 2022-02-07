import Link, { LinkProps } from 'next/link'
import { forwardRef } from 'react'

type RefLinkProps = LinkProps & { children: React.ReactNode }

export const RefLink = forwardRef<HTMLAnchorElement, RefLinkProps>(({ children, ...props }, forwardedRef) => (
    <Link {...props}>
        <a ref={forwardedRef}>{children}</a>
    </Link>
))
RefLink.displayName = 'RefLink'
