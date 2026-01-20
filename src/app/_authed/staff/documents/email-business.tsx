import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(() => import("@/features/business-email/page-client"));

export const Route = createFileRoute("/_authed/staff/documents/email-business")(
  {
    component: () => (
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    ),
  },
);
