import type { NextPageWithLayout } from '../_app'

import { useRouter } from 'next/router'
import { trpc } from '@/lib/trpc'

import NextError from 'next/error'

const PostViewPage: NextPageWithLayout = () => {
    const id = useRouter().query.id as string
    const postQuery = trpc.useQuery(['post.byId', { id }])

    if (postQuery.error) {
        return <NextError title={postQuery.error.message} statusCode={postQuery.error.data?.httpStatus ?? 500} />
    }

    if (postQuery.status !== 'success') {
        return <>Loading...</>
    }

    const { data } = postQuery

    return (
        <>
            <h1>{data.title}</h1>
            <em>Created {data.createdAt.toLocaleDateString()}</em>

            <p>{data.text}</p>
            <p>Author: {data.user.name}</p>

            <h2>Raw data:</h2>
            <pre>{JSON.stringify(data, null, 4)}</pre>
        </>
    )
}

export default PostViewPage
