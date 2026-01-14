import { RouterProvider, createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { routeTree } from "./routeTree.gen";
import { useAuthStore, type AuthState } from "./store/auth";
import { QueryClient } from "@tanstack/react-query";

export function getRouter() {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
    context: {
      auth: undefined! as AuthState, // This will be set in RouterProvider
    },
  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });
  return router;
}

export function InnerApp({ router }: { router: ReturnType<typeof getRouter> }) {
  const auth = useAuthStore();
  return <RouterProvider router={router} context={{ auth }} />;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
