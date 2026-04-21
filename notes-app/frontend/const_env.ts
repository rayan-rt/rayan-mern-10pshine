const ENV_VARS: Record<string, string> = {
  BACKEND_URL: String(import.meta?.env?.VITE_BACKEND_URL),
} as const;

export { ENV_VARS };
