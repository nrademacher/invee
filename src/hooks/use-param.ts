import { useRouter } from 'next/router'
import { useMemo } from 'react'

export function useParam(key: string, value: string) {
    const router = useRouter()

    const pushParam = async () => {
        router.push(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    [key]: value,
                },
            },
            undefined,
            { shallow: true }
        )
    }

    const clearParam = () => {
        // workaround to avoid usage of delete operator
        const { [key]: value, ...query } = router.query // eslint-disable-line @typescript-eslint/no-unused-vars
        router.replace({
            query,
        })
    }

    const href = useMemo(() => {
        const query = {
            ...router.query,
            [key]: value,
        }
        return {
            query,
        }
    }, [router.query, key, value])

    return {
        pushParam,
        clearParam,
        href,
        isOn: router.query[key] === value,
    }
}
