import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/lifeInsurance/paidout-detail/page.client"),
);
export const Route = createFileRoute(
  "/_authed/staff/life-insurance/paidout-detail",
)({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
