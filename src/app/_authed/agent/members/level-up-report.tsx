import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/members/level-up-report/page-client'))

export const Route = createFileRoute('/_authed/agent/members/level-up-report')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
