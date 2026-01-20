import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/staffs/permissions/page.client"));
export const Route = createFileRoute("/_authed/staff/staffs/permissions")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
