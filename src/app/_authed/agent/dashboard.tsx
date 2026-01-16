import { createFileRoute } from "@tanstack/react-router";
import DashboardPageClient from "~/features/dashboard/page.client";

export const Route = createFileRoute("/_authed/agent/dashboard")({
  component: DashboardPageClient,
});
