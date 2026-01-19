import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/nonlife-insurance/list-done/page-client'))

export const Route = createFileRoute('/_authed/agent/non-life-insurance/list-done')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
