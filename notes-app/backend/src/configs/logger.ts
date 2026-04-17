import "dotenv/config";
import pino from "pino";
// --

const env = process.env["NODE_ENV"] || "development";
const logLevel = process.env["LOG_LEVEL"] || "info";

const transport =
  env === "development"
    ? pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "req,res,responseTime", // Hide these fields for minimal logs
        },
      })
    : undefined;

const logger = pino(
  {
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    // base: { service: "notes-api" },
    // redact: ["req.headers.authorization", "body.password"],
  },
  transport,
);

export { logger };
