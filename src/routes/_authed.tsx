import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AppSidebar from "~/components/layout/sidebar";
import AppHeader from "~/components/layout/header";
import { API_ENDPOINTS } from "~/constant/api-endpoints";
import { ROLES } from "~/constant";
import { api } from "~/lib/api";
import { getIdFormFromPathname } from "~/utils/auth-utils";

export const Route = createFileRoute("/_authed")({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }

    const { user, role } = context.auth;

    // Check permission for Staff via API (thay thế AuthGuard logic cũ)
    if (role === ROLES.STAFF && user) {
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
