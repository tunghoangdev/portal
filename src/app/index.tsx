import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    // Nếu chưa đăng nhập, redirect về login
    // Nếu đã đăng nhập, redirect về dashboard
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    } else {
      throw redirect({
        to: "/staff/dashboard",
      });
    }
  },
});
