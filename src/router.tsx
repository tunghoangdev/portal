import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { DefaultCatchBoundary } from "./components/DefaultCatchBoundary";
import { NotFound } from "./components/NotFound";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./stores/auth-store";
import { QueryClient } from "@tanstack/react-query";

export function getRouter() {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    defaultPreload: false,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
    context: {
      auth: useAuthStore.getState(), // Use the real store state
    },
  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });
  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

