import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('@/features/abroad/list-processing/page.client'))

export const Route = createFileRoute('/_authed/staff/abroad/list-processing')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
