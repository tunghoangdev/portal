import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/program/meeting/page-client"));
export const Route = createFileRoute("/_authed/staff/meeting")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
