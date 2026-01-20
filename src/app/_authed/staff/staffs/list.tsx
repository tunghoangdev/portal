import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/staffs/page-client"));
export const Route = createFileRoute("/_authed/staff/staffs/list")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
