import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const DashboardPageClient = lazy(
  () => import("~/features/dashboard/page.client"),
);
export const Route = createFileRoute("/_authed/staff/dashboard")({
  component: () => (
    <Suspense fallback={null}>
      <DashboardPageClient />
    </Suspense>
  ),
});
