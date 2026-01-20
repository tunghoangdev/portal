import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/reports/paidout-detail/page.client"),
);
export const Route = createFileRoute("/_authed/staff/report/paidout-detail")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
