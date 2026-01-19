import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/dashboard/page.client'))

export const Route = createFileRoute('/_authed/agent/dashboard')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
