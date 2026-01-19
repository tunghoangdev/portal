import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('@/features/customers/page-client'))

export const Route = createFileRoute('/_authed/agent/customers')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
