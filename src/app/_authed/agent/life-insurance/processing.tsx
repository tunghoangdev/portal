import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('@/features/lifeInsurance/processing/page-client'))

export const Route = createFileRoute('/_authed/agent/life-insurance/processing')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
