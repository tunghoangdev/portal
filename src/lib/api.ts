import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL, ERROR_CODES } from "~/constant";
import type { Endpoint } from "~/types/axios";
import { getToken, logout } from "./auth";

// 👉 Cấu hình instance
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cho phép custom endpoint
declare module "axios" {
  export interface AxiosRequestConfig {
    endpoint?: Endpoint;
  }
}

// Interceptor Request
axiosClient.interceptors.request.use((config) => {
  const token = getToken();
  if (config.endpoint) {
    config.baseURL += `/${config.endpoint}`;
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor Response
axiosClient.interceptors.response.use(
  (response) => {
    if (response.data?.data) {
      return response.data.data;
    }

    if (response.data?.content) {
      return response.data.content;
    }
    if (response.data?.error_code) {
      const errorCode = response.data.error_code;
      if (errorCode === "1") {
        // Token expired
        logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        // return Promise.reject("Token expired");
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      }
      toast.error(
        (ERROR_CODES?.[errorCode] as string) || "Có lỗi xảy ra trong hệ thống",
      );
      // return Promise.reject();
      // return Promise.reject(new Error(ERROR_CODES?.[errorCode] as string));
    }
    return response.data;
  },
  (err) => {
    const status = err.response?.status;
    if (status === 403 || status === 401) {
      toast.error("Hết phiên đăng nhập");
      logout();
      window.location.href = "/login";
    } else {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    }
    return Promise.reject(err);
  },
);

export const api = {
  get: <T>(url: string, endpoint?: Endpoint | string) =>
    axiosClient
      .get<T>(url, { endpoint: endpoint as Endpoint })
      .then((res) => res),

  post: <T>(url: string, data: any, endpoint?: Endpoint | string) =>
    axiosClient
      .post<T>(url, data, { endpoint: endpoint as Endpoint })
      .then((res) => res),
  postForm: <T>(url: string, data: any, endpoint?: Endpoint | string) =>
    axiosClient
      .post<T>(url, data, {
        endpoint: endpoint as Endpoint,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res),
  put: <T>(url: string, data: any, endpoint?: Endpoint | string) =>
    axiosClient
      .put<T>(url, data, { endpoint: endpoint as Endpoint })
      .then((res) => res),

  delete: <T>(url: string, endpoint?: Endpoint | string) =>
    axiosClient
      .delete<T>(url, { endpoint: endpoint as Endpoint })
      .then((res) => res),

  patch: <T>(url: string, data: any, endpoint?: Endpoint | string) =>
    axiosClient
      .patch<T>(url, data, { endpoint: endpoint as Endpoint })
      .then((res) => res),
};
export default axiosClient;
