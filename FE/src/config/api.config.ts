export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: import.meta.env.VITE_AUTH_TOKEN,
} as const;
