import type React from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "~/stores/auth-store"; // Dùng đúng store của project
import { MENU_SETTINGS } from "~/constant/site-menu";
import { useCrud } from "~/hooks/use-crud-v2";
import { API_ENDPOINTS, NORMALIZE_URLS } from "~/constant/api-endpoints";
import { useAuth, useCommon } from "~/hooks";
import { ROLES } from "~/constant";
// import { useCommonStore } from "~/store"; // Check if you need this or if it should be ~/store/something

interface AuthGuardProps {
  children: React.ReactNode;
}
/**
 * Hàm lấy idForm từ pathname
 * @param pathname - Đường dẫn hiện tại
 * @returns ID của form tương ứng với pathname
 */
export const getIdFormFromPathname = (pathname: string): number => {
  const normalizedPath = pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;

  if (NORMALIZE_URLS.includes(normalizedPath)) {
    return 0;
  }

  // Xử lý cho menu staff
  if (normalizedPath.startsWith("/staff")) {
    // Kiểm tra trong menu cấp 1
    for (const section of MENU_SETTINGS.staff) {
      if (typeof section === "object") {
        // Kiểm tra nếu section có url trùng với normalizedPath
        if ("url" in section && section.url === normalizedPath) {
          return section.id_form || 0;
        }

        // Kiểm tra trong children của section (menu cấp 2)
        if (section.children && Array.isArray(section.children)) {
          for (const subSection of section.children) {
            if (typeof subSection === "object" && "url" in subSection) {
              if (subSection.url === normalizedPath) {
                return subSection.id_form || 0;
              }

              // Kiểm tra trong children của subSection (menu cấp 3 nếu có)
              if (subSection.children && Array.isArray(subSection.children)) {
                for (const subSubSection of subSection.children) {
                  if (
                    typeof subSubSection === "object" &&
                    "url" in subSubSection
                  ) {
                    if (subSubSection.url === normalizedPath) {
                      return subSubSection.id_form || 0;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return 0;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  
  const { role, user } = useAuth(); // Consider checking where useAuth comes from
  
  // Note: useCrud part might need attention if it's integrated with TanStack Query
  const { getAll } = useCrud(
    [API_ENDPOINTS.permission.getAccessForm, pathname],
    {
      id: user?.id,
    },
    {
      enabled: role === ROLES.STAFF && !!user?.id,
    }
  );
  const { data: formAccess }: any = getAll();
  const { formIds } = useCommon();
  // const { setData } = useCommonStore();
  
  const { isAuthenticated, checkAuthStatusAction, checkAuthPermission } =
    useAuthStore();

  useEffect(() => {
    // Note: checkAuthStatusAction might need adjustment for TanStack router
    checkAuthStatusAction(pathname, (to: string) => navigate({ to }));
  }, [pathname, navigate, checkAuthStatusAction]);

  useEffect(() => {
    if (
      !user ||
      pathname === "/login" ||
      pathname === "/samtek/login" ||
      !formAccess ||
      !Array.isArray(formAccess) ||
      formAccess.length === 0
    ) {
      return;
    }

    const formIdsList = formAccess?.map((item: any) => item.id_form) || [];
    
    // if (!formIds) {
    //   setData("formIds", formIdsList);
    // }
    
    checkAuthPermission(pathname, (to: string) => navigate({ to }), formIdsList);
  }, [pathname, formAccess, user?.id, navigate]);

  if (!isAuthenticated && pathname !== "/login" && pathname !== "/register" && pathname !== "/samtek/login") {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
