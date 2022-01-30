import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useSessionGuard(redirectRoute = '/auth/login') {
    const { data, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push(redirectRoute)
        }
    }, [status, router, redirectRoute])

    return { data, status }
}
