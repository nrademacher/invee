/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    type DefaultSessionUser = NonNullable<DefaultSession['user']>
    type CustomSessionUser = DefaultSessionUser & {
        id: string
        avatarUrl?: string
    }
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
     */
    interface Session {
        user: CustomSessionUser
    }
}
