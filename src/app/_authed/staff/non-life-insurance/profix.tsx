import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/nonlife-insurance/profix/page.client"),
);
export const Route = createFileRoute(
  "/_authed/staff/non-life-insurance/profix",
)({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
