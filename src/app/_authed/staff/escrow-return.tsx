import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/program/escrow-return/page-client"));
export const Route = createFileRoute("/_authed/staff/escrow-return")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
