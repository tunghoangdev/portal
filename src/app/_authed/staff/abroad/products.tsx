import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('@/features/abroad/products/page.client'))

export const Route = createFileRoute('/_authed/staff/abroad/products')({
  component: () => <Suspense fallback={null}><Page /></Suspense>,
})
