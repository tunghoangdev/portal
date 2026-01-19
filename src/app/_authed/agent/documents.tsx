import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/documents/page.client'))

export const Route = createFileRoute('/_authed/agent/documents')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
