import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AppSidebar from "~/components/layout/sidebar";
import AppHeader from "~/components/layout/header";

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
        <AppHeader />
        <main className="grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
