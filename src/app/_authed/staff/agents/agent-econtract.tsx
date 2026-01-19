import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
const Page = lazy(() => import('@/features/agents/agent-econtract/page-client'))

export const Route = createFileRoute('/_authed/staff/agents/agent-econtract')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
