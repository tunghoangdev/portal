import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/reports/commission/page.client"));
export const Route = createFileRoute("/_authed/staff/report/commission")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
