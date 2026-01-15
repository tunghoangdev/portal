import { useEffect } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth";
import type { getRouter } from "../router";

export function InnerApp({ router }: { router: ReturnType<typeof getRouter> }) {
  const auth = useAuthStore();
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);
  
  return <RouterProvider router={router} context={{ auth }} />;
}
