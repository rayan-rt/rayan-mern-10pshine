const ENV_VARS: Record<string, string> = {
  BACKEND_URL: String(import.meta.env.VITE_BACKEND_URL),
  LOGGING_ENDPOINT: String(import.meta.env.VITE_LOGGING_ENDPOINT),
} as const;

export { ENV_VARS };
