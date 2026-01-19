import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
const Page = lazy(() => import('@/features/agents/assign-level/page-client'))

export const Route = createFileRoute('/_authed/staff/agents/assign-level')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})

