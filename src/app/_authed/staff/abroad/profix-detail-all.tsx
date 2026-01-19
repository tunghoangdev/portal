import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('@/features/abroad/profix-detail-all/page.client'))

export const Route = createFileRoute('/_authed/staff/abroad/profix-detail-all')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
