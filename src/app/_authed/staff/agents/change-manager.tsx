import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
const Page = lazy(() => import('@/features/agents/change-manager/page-client'))

export const Route = createFileRoute('/_authed/staff/agents/change-manager')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
