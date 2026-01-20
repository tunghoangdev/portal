import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/doc-member-internal/page-client"));
export const Route = createFileRoute(
  "/_authed/staff/documents/member-internal",
)({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
