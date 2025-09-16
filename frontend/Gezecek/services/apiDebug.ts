// API Configuration Test Helper
// This file helps debug and validate the API configuration

import { API_CONFIG } from "./api";

export const debugApiConfig = () => {
  console.log("API Configuration Debug Info:");
  console.log("Base URL:", API_CONFIG.BASE_URL);
  console.log("Timeout:", API_CONFIG.TIMEOUT);
  console.log("Debug Mode:", API_CONFIG.DEBUG);
  console.log("Version:", API_CONFIG.VERSION);
  console.log("Storage Keys:", API_CONFIG.STORAGE_KEYS);

  console.log("\nEnvironment Variables:");
  console.log("DEV URL:", process.env.EXPO_PUBLIC_API_BASE_URL_DEV);
  console.log("PROD URL:", process.env.EXPO_PUBLIC_API_BASE_URL_PROD);
  console.log("TIMEOUT:", process.env.EXPO_PUBLIC_API_TIMEOUT);
  console.log("DEBUG:", process.env.EXPO_PUBLIC_API_DEBUG);
  console.log("PREFIX:", process.env.EXPO_PUBLIC_STORAGE_PREFIX);
  console.log("VERSION:", process.env.EXPO_PUBLIC_API_VERSION);
  console.log("__DEV__:", __DEV__);
};

// Call this function in development to see your configuration
if (__DEV__) {
  debugApiConfig();
}
