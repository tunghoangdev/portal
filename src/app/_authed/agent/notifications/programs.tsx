import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/notifications/programs/page.client'))

export const Route = createFileRoute('/_authed/agent/notifications/programs')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
