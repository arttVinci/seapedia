import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiErrorResponse } from "../@types/base/api.types";
import { STORAGE_KEYS } from "../config/api.config";
import { API_CONFIG } from "../config/api.config";
import { ApiError } from "./apiError";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create(API_CONFIG);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError,
    );

    this.client.interceptors.response.use(
      (response) => response,
      this.handleResponseError,
    );
  }

  private handleRequest(
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }

  private handleRequestError(error: AxiosError): Promise<never> {
    return Promise.reject(error);
  }

  private handleResponseError(
    error: AxiosError<ApiErrorResponse>,
  ): Promise<never> {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      window.location.href = "/auth/login";
    }

    const message = error.response?.data?.message || "An error occurred";
    const statusCode = error.response?.status || 500;
    const errors = error.response?.data?.errors;

    throw new ApiError(message, statusCode, errors);
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

export default new ApiClient().getInstance();
