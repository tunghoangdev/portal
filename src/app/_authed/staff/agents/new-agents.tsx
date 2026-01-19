import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
const Page = lazy(() => import('@/features/agents/new-agents/page-client'))

export const Route = createFileRoute('/_authed/staff/agents/new-agents')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})

