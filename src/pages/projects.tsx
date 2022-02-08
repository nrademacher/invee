import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { SidebarLayout } from '@/components'

export default function Projects() {
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/auth/login')
        },
    })

    if (status === 'loading' || !session) return <div>Loading ...</div>

    return (
        <SidebarLayout pageName="Projects" currentUserName={session.user.name as string}>
            Placeholder
        </SidebarLayout>
    )
}
