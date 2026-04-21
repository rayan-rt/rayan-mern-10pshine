const ENV_VARS: Record<string, string> = {
  BACKEND_URL: String(import.meta?.env?.VITE_BACKEND_URL),
  BACKEND_API_VERSION: String(import.meta?.env?.VITE_BACKEND_API_VERSION),
} as const;

export { ENV_VARS };
