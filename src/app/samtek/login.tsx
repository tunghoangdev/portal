import { createFileRoute } from "@tanstack/react-router";
import SamteckLoginPage from "~/features/auth/samtek-login-page";
import { Suspense } from "react";

export const Route = createFileRoute("/samtek/login")({
  component: () => <Suspense fallback={null}><SamteckLoginPage /></Suspense>,
});
