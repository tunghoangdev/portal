import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "~/store/auth";

export const Route = createFileRoute("/logout")({
  preload: false,
  loader: () => {
    useAuthStore.getState().logout();
    throw redirect({
      to: "/",
    });
  },
});
