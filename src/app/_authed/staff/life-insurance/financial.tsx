import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/lifeInsurance/financial/page-client"),
);
export const Route = createFileRoute("/_authed/staff/life-insurance/financial")(
  {
    component: () => (
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    ),
  },
);
