import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
const Page = lazy(() => import('~/features/members/level-up-log/page-client'))
export const Route = createFileRoute('/_authed/agent/members/level-up-log')({
  component: () =>  <Suspense fallback={null}><Page /></Suspense>
})
