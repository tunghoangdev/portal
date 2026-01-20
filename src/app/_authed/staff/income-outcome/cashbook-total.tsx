import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/income-outcome/cashbook-total/page.client"),
);
export const Route = createFileRoute(
  "/_authed/staff/income-outcome/cashbook-total",
)({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
