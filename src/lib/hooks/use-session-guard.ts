import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export function useSessionGuard() {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/login')
        },
    })

    return { session, status }
}
