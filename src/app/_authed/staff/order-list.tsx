import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/samtek/orders/page-client"));
export const Route = createFileRoute('/_authed/staff/order-list')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  )
}
