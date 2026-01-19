import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/lifeInsurance/canceled/page.client'))

export const Route = createFileRoute('/_authed/agent/life-insurance/canceled')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
