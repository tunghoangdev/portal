import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
const Page = lazy(() => import('@/features/agents/list/page-client'))

export const Route = createFileRoute('/_authed/staff/agents/list')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
