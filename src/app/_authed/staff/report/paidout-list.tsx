import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/reports/paidout-list/page.client"));
export const Route = createFileRoute("/_authed/staff/report/paidout-list")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
