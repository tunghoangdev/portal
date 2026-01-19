import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('@/features/lifeInsurance/list-done/page-client'))

export const Route = createFileRoute('/_authed/agent/life-insurance/list-done')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
