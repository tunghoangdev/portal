import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/lifeInsurance/commission-list/page-client"),
);
export const Route = createFileRoute(
  "/_authed/staff/life-insurance/commission-list",
)({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
