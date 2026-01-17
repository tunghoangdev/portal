import type React from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "~/stores/auth-store";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  
  const { _hasHydrated, isAuthenticated, checkAuthStatusAction } = useAuthStore();

  useEffect(() => {
    // Chỉ chạy logic check auth cơ bản và redirect login/dashboard khi hydrate xong
    if (_hasHydrated) {
      checkAuthStatusAction(pathname, (to: string) => navigate({ to }));
    }
  }, [pathname, navigate, checkAuthStatusAction, _hasHydrated]);

  if (!_hasHydrated) {
    return null; // Tránh hydration mismatch
  }

  // Basic failsafe check
  if (!isAuthenticated && pathname !== "/login" && pathname !== "/register" && pathname !== "/samtek/login") {
    return null; 
  }

  return <>{children}</>;
};

export default AuthGuard;
