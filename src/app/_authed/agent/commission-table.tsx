import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('@/features/commission-table/page-client'))

export const Route = createFileRoute('/_authed/agent/commission-table')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
