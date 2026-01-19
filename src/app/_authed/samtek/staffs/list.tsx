import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/samtek/staffs/page-client'))

export const Route = createFileRoute('/_authed/samtek/staffs/list')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
