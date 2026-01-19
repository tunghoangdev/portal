import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/notifications/meeting/page-client'))

export const Route = createFileRoute('/_authed/agent/notifications/meeting')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
