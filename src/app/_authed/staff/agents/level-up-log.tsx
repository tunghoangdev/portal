import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
const Page = lazy(() => import('@/features/agents/level-up-log/page-client'))

export const Route = createFileRoute('/_authed/staff/agents/level-up-log')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
