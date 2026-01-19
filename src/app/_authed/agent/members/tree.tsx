import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/shared/components/tree/page-client'))

export const Route = createFileRoute('/_authed/agent/members/tree')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
