import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
const Page = lazy(() => import('@/features/shared/components/tree/page-client'))

export const Route = createFileRoute('/_authed/staff/agents/tree')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})

