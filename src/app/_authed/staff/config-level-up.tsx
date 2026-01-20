import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/config-level-up/page.client"));
export const Route = createFileRoute("/_authed/staff/config-level-up")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
