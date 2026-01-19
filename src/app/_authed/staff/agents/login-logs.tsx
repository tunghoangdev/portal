import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
const Page = lazy(() => import('@/features/agents/login-logs/page-client'))

export const Route = createFileRoute('/_authed/staff/agents/login-logs')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
