import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/types/page.client"));
export const Route = createFileRoute("/_authed/staff/documents/types")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
