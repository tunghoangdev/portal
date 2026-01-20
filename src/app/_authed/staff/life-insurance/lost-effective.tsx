import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/lifeInsurance/lost-effective/page-client"),
);
export const Route = createFileRoute(
  "/_authed/staff/life-insurance/lost-effective",
)({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
