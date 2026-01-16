import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "~/components/layout";
import Header from "~/components/layout/header";
import { SidebarInset, SidebarProvider } from "~/components/ui";
import {
  ModalManager,
  RowActionsDropdownPortal,
} from "~/features/shared/components";
import ModalNotice from "~/features/shared/components/modal-notice";

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context }) => {
    if (typeof window === "undefined") {
      return;
    }
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-white overflow-x-hidden shadow-sm px-2.5 md:px-5 pt-2.5 rounded-md md:rounded-xl md:m-2">
        <Header />
        <Outlet />
      </SidebarInset>
      <ModalManager />
      <ModalNotice />
      <RowActionsDropdownPortal />
    </SidebarProvider>
  );
}
