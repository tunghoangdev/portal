import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/commission-type/page.client"));
export const Route = createFileRoute("/_authed/staff/commission-type")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
