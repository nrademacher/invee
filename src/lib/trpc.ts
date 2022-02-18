import type { AppRouter } from '@/server/routers/app-router'
import { createReactQueryHooks } from '@trpc/react'
import type { inferProcedureOutput } from '@trpc/server'

export const {
    useContext: useTRPCContext,
    useQuery: useTRPCQuery,
    useMutation: useTRPCMutation,
} = createReactQueryHooks<AppRouter>()

export type inferQueryOutput<TRouteKey extends keyof AppRouter['_def']['queries']> = inferProcedureOutput<
    AppRouter['_def']['queries'][TRouteKey]
>
