import { useAuthStore } from "~/stores";
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const idForm = useAuthStore((state) => state.idForm);
  const avatar = useAuthStore((state) => state.avatar);
  const role = useAuthStore((state) => state.role);
  const token = useAuthStore((state) => state.token);
  const logoutAction = useAuthStore((state) => state.logoutAction);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return {
    user,
    role,
    idForm,
    avatar,
    token,
    logoutAction,
    isAuthenticated,
  };
};
