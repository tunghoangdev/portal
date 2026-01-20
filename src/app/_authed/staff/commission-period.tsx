import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/commission-period/page.client"));
export const Route = createFileRoute("/_authed/staff/commission-period")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
