import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/income-outcome/outcome-config/page-client"),
);
export const Route = createFileRoute("/_authed/staff/income-outcome/outcome")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
