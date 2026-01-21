import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/same-store/page-client"));
export const Route = createFileRoute("/_authed/staff/samtek-store")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
