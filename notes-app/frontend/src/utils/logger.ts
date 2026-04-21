import log from "loglevel";
import { ENV_VARS } from "../const_env.js";

const isProduction = import.meta.env.PROD;

const originalFactory = log.methodFactory;
log.methodFactory = (methodName, logLevel, loggerName) => {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);

  return (...message) => {
    // 1. Always log to local console
    rawMethod(...message);

    // 2. In production (or for errors), send to Backend
    if (isProduction || methodName === "error") {
      const logBody = {
        level: methodName.toUpperCase(),
        message: message.join(" "),
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      const loggingUrl = `${ENV_VARS.BACKEND_URL}${ENV_VARS.LOGGING_ENDPOINT}`;

      // Send to your backend logging endpoint
      fetch(loggingUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logBody),
      }).catch(() => {
        /* Silently fail to avoid infinite loops */
      });
    }
  };
};

if (isProduction) {
  log.setLevel("warn");
} else {
  log.setLevel("debug");
}

const logger = log;
export { logger };
