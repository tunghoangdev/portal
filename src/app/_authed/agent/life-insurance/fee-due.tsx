import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('@/features/lifeInsurance/fee-due/page-client'))

export const Route = createFileRoute('/_authed/agent/life-insurance/fee-due')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
