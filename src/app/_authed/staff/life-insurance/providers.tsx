import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
const Page = lazy(
  () => import("@/features/lifeInsurance/providers/page.client"),
);
export const Route = createFileRoute("/_authed/staff/life-insurance/providers")(
  {
    component: () => (
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    ),
  },
);
