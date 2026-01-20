import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/doc-member/page-client"));
export const Route = createFileRoute("/_authed/staff/documents/members")({
  component: () => (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  ),
});
