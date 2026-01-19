import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('@/features/abroad/individual/page.client'))

export const Route = createFileRoute('/_authed/agent/abroad/individual')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
