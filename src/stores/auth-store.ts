import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HIDE_NOTIFICATION, ROLES, USER_DATA } from "~/constant";
import { NORMALIZE_URLS } from "~/constant/api-endpoints";
import { getIdFormFromPathname } from "~/features/auth/auth-guard";
import type { User } from "~/types/user";

export interface AuthState {
  user: User | null;
  token: string | null;
  avatar: string | null;
  setAvatar: (avatar: string) => void;
  isStaff: boolean;
  isAuthenticated: boolean;
  idForm: number;
  role: string;
  isLoadingAuth: boolean; // Quản lý trạng thái loading khi kiểm tra auth
  loginAction: (
    userData: User,
    accessToken: string,
    newRefreshToken?: string
  ) => void;
  logoutAction: (navigate: any, redirect?: boolean) => void; // navigate để điều hướng sau khi logout
  checkAuthStatusAction: (pathname: string, navigate: any) => Promise<void>; // navigate để điều hướng
  checkAuthPermission: (
    pathname: string,
    navigate: any,
    formIds: number[]
  ) => Promise<void>; // navigate để điều hướng
  setLoadingAuthAction: (loading: boolean) => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      avatar: null,
      idForm: 0,
      role: ROLES.AGENT,
      token: null,
      isAuthenticated: false,
      isLoadingAuth: true, // Bắt đầu với trạng thái loading
      isStaff: false,
      setLoadingAuthAction: (loading) => set({ isLoadingAuth: loading }),
      setAvatar: (avatar) => set({ avatar }),
      loginAction: (userData, accessToken) => {
        // setAccessToken(accessToken); // Lưu access token vào cookie
        // if (newRefreshToken) {
        // 	setRefreshToken(newRefreshToken); // Lưu refresh token vào localStorage (nếu có)
        // }
        set({
          user: userData,
          token: accessToken,
          isAuthenticated: true,
          isLoadingAuth: false,
          role: userData.role || ROLES.AGENT,
          avatar: userData?.agent_avatar || userData?.staff_avatar,
        });
      },
      logoutAction: (navigate, redirect = true) => {
        set({
          user: null,
          role: "",
          token: null,
          isAuthenticated: false,
          isLoadingAuth: false,
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem(HIDE_NOTIFICATION);
          if (redirect) {
            if (navigate) navigate({ to: "/login" });
            window.location.href = "/login";
          }
        }
      },
      checkAuthStatusAction: async (pathname, navigate) => {
        const token = get().token;
        const user = get().user;

        if (pathname === "/register") {
          if (token && user) {
            get().logoutAction(navigate, false);
          }
          set({ isLoadingAuth: false });
          return;
        }

        // Handle /samtek/login path
        if (pathname === "/samtek/login") {
          if (token && user && user?.role) {
            // User is logged in, check if role is samtek
            if (user.role !== ROLES.SAMTEK) {
              // Wrong role, logout without redirect
              get().logoutAction(navigate, false);
              set({ isLoadingAuth: false });
              return;
            }
            // Correct role (samtek), redirect to samtek dashboard
            set({
              isAuthenticated: true,
              isLoadingAuth: false,
              user,
              token,
              role: user.role,
            });
            navigate({ to: "/samtek/dashboard" });
            return;
          }
          // No user logged in, don't redirect anywhere
          set({
            isAuthenticated: false,
            isLoadingAuth: false,
            user: null,
            token: null,
            role: "",
          });
          return;
        }

        if (pathname === "/login") {
          const token = get().token;
          const user = get().user;

          if (token && user && user?.role) {
            set({
              isAuthenticated: true,
              isLoadingAuth: false,
              user,
              token,
              role: user.role || "",
            });
            navigate({ to: `/${user.role}/dashboard` });
            return;
          }
          set({
            isAuthenticated: false,
            isLoadingAuth: false,
            user: null,
            token: null,
            role: "",
          });
          return;
        }
        // Check if samtek user tries to access staff or agent paths
        if (token && user?.role === ROLES.SAMTEK) {
          if (pathname.startsWith("/staff") || pathname.startsWith("/agent")) {
            // Samtek user trying to access staff/agent paths, logout and redirect to /login
            get().logoutAction(navigate, true);
            return;
          }
        }

        if (token && user?.role && pathname === "/") {
          navigate({ to: `/${user.role}/dashboard` });
        }
        set({ isLoadingAuth: true });
        const currentToken = get().token;
        if (!currentToken) {
          get().logoutAction(navigate); // Gọi logout của store để xử lý state và redirect
          return;
        }
      },

      checkAuthPermission: async (pathname, navigate, formIds) => {
        const idForm = getIdFormFromPathname(pathname);
        const role = get().role;
        if (idForm === 0) {
          return;
        }
        set({ idForm });
        if (
          formIds?.length &&
          !formIds?.some((item: any) => item === idForm) &&
          !NORMALIZE_URLS.includes(pathname)
        ) {
          toast.warning("Bạn không có quyền truy cập vào trang này!");
          navigate({ to: `/${role}/dashboard` });
        }
      },
    }),
    {
      name: USER_DATA,
    }
  )
);
