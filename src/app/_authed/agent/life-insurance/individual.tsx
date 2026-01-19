import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('@/features/agents/individual/page.client'))

export const Route = createFileRoute('/_authed/agent/life-insurance/individual')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
