import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/notification-list/page-client"));
export const Route = createFileRoute("/_authed/staff/notifications/list")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
