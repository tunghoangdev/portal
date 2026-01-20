import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/reports/login-logs/page-client"));
export const Route = createFileRoute("/_authed/staff/report/login-logs")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
