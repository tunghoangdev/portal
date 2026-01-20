import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/program/commission-manual/page-client"),
);
export const Route = createFileRoute("/_authed/staff/commission-manual")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
