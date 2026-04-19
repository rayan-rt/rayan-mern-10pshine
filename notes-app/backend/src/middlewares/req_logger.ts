import { type Request, type Response } from "express";
import pinoHttp from "pino-http";
import { logger } from "../configs/logger.js";
// --

export default pinoHttp({
  logger,
  customLogLevel: (_req: Request, res: Response, err: Error) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  customSuccessMessage: (req: Request, res: Response) =>
    `${req.method} ${req.url} → ${res.statusCode}`,

  customErrorMessage: (req: Request, res: Response, err: Error) =>
    `${req.method} ${req.url} failed — ${err.message}`,

  autoLogging: {
    ignore: (req: Request) => req.url === "/health",
  },
});
