import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/program/commission-table/page-client"),
);
export const Route = createFileRoute("/_authed/staff/commission-table")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
