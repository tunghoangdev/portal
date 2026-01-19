import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "~/features/auth/register/page.client";

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      code: (search.code as string) || "",
      staff: (search.staff as string) || "",
    };
  },
  component: RegisterPage,
});
