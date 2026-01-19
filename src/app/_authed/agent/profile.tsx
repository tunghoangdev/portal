import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/profile/profile.client'))

export const Route = createFileRoute('/_authed/agent/profile')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
