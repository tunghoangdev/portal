// types/axios.ts
import type { AxiosInstance, AxiosRequestConfig } from "axios";
export type Endpoint = "staff" | "agent" | "system" | undefined;
export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  endpoint?: Endpoint;
}
export interface CustomAxiosInstance extends AxiosInstance {
  request<T = any, R = T>(config: CustomAxiosRequestConfig): Promise<R>;
  get<T = any, R = T>(
    url: string,
    config?: CustomAxiosRequestConfig
  ): Promise<R>;
  delete<T = any, R = T>(
    url: string,
    config?: CustomAxiosRequestConfig
  ): Promise<R>;
  head<T = any, R = T>(
    url: string,
    config?: CustomAxiosRequestConfig
  ): Promise<R>;
  post<T = any, R = T>(
    url: string,
    data?: any,
    config?: CustomAxiosRequestConfig
  ): Promise<R>;
  put<T = any, R = T>(
    url: string,
    data?: any,
    config?: CustomAxiosRequestConfig
  ): Promise<R>;
  patch<T = any, R = T>(
    url: string,
    data?: any,
    config?: CustomAxiosRequestConfig
  ): Promise<R>;
}
