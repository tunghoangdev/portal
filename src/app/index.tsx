import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (typeof window !== "undefined") {
      if (!context.auth.isAuthenticated) {
        throw redirect({
          to: "/login",
        });
      } else {
        throw redirect({
          to: `/${context.auth.role}/dashboard` as any,
        });
      }
    }
  },
  component: () => {
    return <div>Home</div>;
  },
});
