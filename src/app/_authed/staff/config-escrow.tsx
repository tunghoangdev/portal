import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/config-escrow/page.client"));
export const Route = createFileRoute("/_authed/staff/config-escrow")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
