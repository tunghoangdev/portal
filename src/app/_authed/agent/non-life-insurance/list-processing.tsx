import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/nonlife-insurance/list-processing/page-client'))

export const Route = createFileRoute('/_authed/agent/non-life-insurance/list-processing')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
