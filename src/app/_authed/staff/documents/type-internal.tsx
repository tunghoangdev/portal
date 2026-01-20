import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/type-internal/page.client"));
export const Route = createFileRoute("/_authed/staff/documents/type-internal")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
