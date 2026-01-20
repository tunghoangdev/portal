import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/nonlife-insurance/providers/page.client"),
);
export const Route = createFileRoute(
  "/_authed/staff/non-life-insurance/providers",
)({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
