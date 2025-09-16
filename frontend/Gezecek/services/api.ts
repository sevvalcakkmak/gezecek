import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Type extensions for axios
declare module "axios" {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
    _retry?: boolean;
  }
}

// API Error Response Type
interface ApiErrorResponse {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

// API Configuration
const getApiConfig = () => {
  const isDev = __DEV__;
  const baseUrl = isDev ? process.env.EXPO_PUBLIC_API_BASE_URL_DEV || "http://localhost:3000/api" : process.env.EXPO_PUBLIC_API_BASE_URL_PROD || "https://your-production-api.com/api";

  return {
    BASE_URL: baseUrl,
    TIMEOUT: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || "10000", 10),
    STORAGE_KEYS: {
      TOKEN: `${process.env.EXPO_PUBLIC_STORAGE_PREFIX || "@gezecek"}_token`,
      REFRESH_TOKEN: `${process.env.EXPO_PUBLIC_STORAGE_PREFIX || "@gezecek"}_refresh_token`,
      USER: `${process.env.EXPO_PUBLIC_STORAGE_PREFIX || "@gezecek"}_user`,
    },
    DEBUG: process.env.EXPO_PUBLIC_API_DEBUG === "true" || __DEV__,
    VERSION: process.env.EXPO_PUBLIC_API_VERSION || "v1",
  };
};

const API_CONFIG = getApiConfig();

// Request/Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  errors?: Record<string, string[]>;
}

// API Client Class
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Add auth token to requests
        const token = await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for logging
        config.metadata = { startTime: new Date() };

        // Log request in development
        if (API_CONFIG.DEBUG) {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
          console.log("📤 Request data:", config.data);
        }

        return config;
      },
      (error) => {
        if (API_CONFIG.DEBUG) {
          console.error("❌ Request Error:", error);
        }
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Log response in development
        if (API_CONFIG.DEBUG) {
          const duration = new Date().getTime() - (response.config.metadata?.startTime?.getTime() || 0);
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
          console.log("📥 Response data:", response.data);
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle token refresh for 401 errors
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const newToken = response.data.token;

              await AsyncStorage.setItem(API_CONFIG.STORAGE_KEYS.TOKEN, newToken);

              this.processQueue(null, newToken);

              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            await this.clearAuthData();
            // Redirect to login or emit auth error event
          } finally {
            this.isRefreshing = false;
          }
        }

        // Log error in development
        if (API_CONFIG.DEBUG) {
          console.error("❌ API Error:", {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
          });
        }

        return Promise.reject(this.normalizeError(error as AxiosError<ApiErrorResponse>));
      }
    );
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private normalizeError(error: AxiosError<ApiErrorResponse>): ApiError {
    const response = error.response;

    return {
      message: response?.data?.message || error.message || "An unexpected error occurred",
      status: response?.status || 0,
      code: response?.data?.code,
      errors: response?.data?.errors,
    };
  }

  private async refreshToken(refreshToken: string) {
    return this.client.post("/auth/refresh", { refreshToken });
  }

  private async clearAuthData() {
    await AsyncStorage.multiRemove([API_CONFIG.STORAGE_KEYS.TOKEN, API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, API_CONFIG.STORAGE_KEYS.USER]);
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // File upload method
  async upload<T = any>(url: string, file: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, file, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Download method
  async download(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    const response = await this.client.get(url, {
      ...config,
      responseType: "blob",
    });
    return response.data;
  }

  // Utility methods
  setAuthToken(token: string) {
    this.client.defaults.headers.Authorization = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.client.defaults.headers.Authorization;
  }

  setBaseURL(baseURL: string) {
    this.client.defaults.baseURL = baseURL;
  }

  // Get axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();

// Export types and config
export { API_CONFIG };
export type { AxiosRequestConfig, AxiosResponse };
