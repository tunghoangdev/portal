import { useAuth } from "~/context";
import axiosClient from "~/lib/axios-client";

export function useAxiosClient() {
	const { user } = useAuth();
	const endpoint = user?.role === "staff" ? "staff" : "agent";

	return {
		get: <T>(url: string, config?: any) =>
			axiosClient.get<T>(url, { ...config, endpoint }),

		post: <T>(url: string, data: any, config?: any) =>
			axiosClient.post<T>(url, data, { ...config, endpoint }),

		put: <T>(path: string, body: any, options?: any) =>
			axiosClient<T>(path, { ...options, method: "PUT", body, endpoint }),

		delete: <T>(path: string, options?: any) =>
			axiosClient<T>(path, { ...options, method: "DELETE", endpoint }),

		custom: <T>(path: string, customOptions: any) =>
			axiosClient<T>(path, {
				...customOptions,
				endpoint: customOptions.endpoint || endpoint,
			}),
	};
}
