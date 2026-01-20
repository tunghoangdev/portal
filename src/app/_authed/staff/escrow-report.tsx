import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/program/escrow-report/page-client"));
export const Route = createFileRoute("/_authed/staff/escrow-report")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
