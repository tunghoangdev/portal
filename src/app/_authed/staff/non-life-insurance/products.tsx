import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/nonlife-insurance/products/page.client"),
);
export const Route = createFileRoute(
  "/_authed/staff/non-life-insurance/products",
)({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
