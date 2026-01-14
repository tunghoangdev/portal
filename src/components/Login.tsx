import { useRouter } from "@tanstack/react-router";
import * as React from "react";
import { useAuthStore } from "../store/auth";

export function Login() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = React.useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) {
      setError("Email is required");
      return;
    }

    // Client-side login simulation
    login(email);
    router.invalidate();
    router.navigate({ to: "/" });
  };

  return (
    <div className="p-2 gap-2 flex flex-col max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold">Login</h2>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <label>
          Email:
          <input
            name="email"
            type="email"
            className="border p-2 rounded w-full"
            placeholder="Enter any email"
            required
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
