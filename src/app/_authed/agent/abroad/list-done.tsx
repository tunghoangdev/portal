import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('@/features/abroad/list-done/page.client'))

export const Route = createFileRoute('/_authed/agent/abroad/list-done')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
