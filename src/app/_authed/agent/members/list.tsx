import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/members/list/page-client'))

export const Route = createFileRoute('/_authed/agent/members/list')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
