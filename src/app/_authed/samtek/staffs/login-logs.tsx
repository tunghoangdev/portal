import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('~/features/samtek/login-logs/page-client'))

export const Route = createFileRoute('/_authed/samtek/staffs/login-logs')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
