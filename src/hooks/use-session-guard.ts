import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export function useSessionGuard() {
    const { push, query } = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            push('/auth/login')
        },
    })

    return { session, status, query }
}
