import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/reports/income-outcome/page-client"),
);
export const Route = createFileRoute("/_authed/staff/report/income-outcome")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
