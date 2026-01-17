import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "~/components/layout";
import Header from "~/components/layout/header";
import { SidebarInset, SidebarProvider } from "~/components/ui";
import { ROLES } from "~/constant";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import {
  ModalManager,
  RowActionsDropdownPortal,
} from "~/features/shared/components";
import ModalNotice from "~/features/shared/components/modal-notice";
import api from "~/lib/api";
import { getIdFormFromPathname } from "~/utils/auth-utils";

export const Route = createFileRoute("/_authed")({
   beforeLoad: async ({ context, location }) => {
      if (!context.auth.isAuthenticated && typeof window !== "undefined") {
        throw redirect({
          to: "/login",
        });
      }
  
      const { user, role } = context.auth;
  
      // Check permission for Staff via API (thay thế AuthGuard logic cũ)
      if (role === ROLES.STAFF && user && typeof window !== "undefined") {
        try {
          const queryClient = (context as any).queryClient;
          const formAccess = await queryClient.ensureQueryData({
            queryKey: [API_ENDPOINTS.permission.getAccessForm, "permission-check", user.id],
            queryFn: async () => {
               return await api.post<any[]>(
                  `/${API_ENDPOINTS.permission.getAccessForm}`,
                  {
                    id: user.id,
                    id_staff: user.id,
                    id_staff_action: user.id,
                    secret_key: user.secret_key,
                    token: user.token
                  }
               );
            },
            staleTime: 1000 * 60 * 5, // Cache 5 phút
          });
  
          const idForm = getIdFormFromPathname(location.pathname);
          
          if (idForm !== 0) {
             const hasPermission = Array.isArray(formAccess) && formAccess.some((item: any) => item.id_form === idForm);
             if (!hasPermission) {
               throw redirect({ to: '/staff/dashboard' as any });
             }
          }
        } catch (error) {
          console.error("Permission check failed in beforeLoad:", error);
        }
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
