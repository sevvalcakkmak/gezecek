// Main API exports - everything needed to work with the API

// Core API client and types
export { apiClient, API_CONFIG } from "./api";
export type { ApiResponse, ApiError } from "./api";

// API Context and hooks
export { ApiProvider, useApi, useApiState, useApiRequest, useApiError } from "./apiContext";

// Service modules with typed methods
export { apiServices, tripService, placesService, uploadService } from "./apiServices";
export type { Trip, CreateTripRequest, Place } from "./apiServices";

// Debug helper (automatically runs in development)
export { debugApiConfig } from "./apiDebug";

// Re-export axios types for convenience
export type { AxiosRequestConfig, AxiosResponse } from "axios";
