import cors from "cors";
import express, { type Express, type Response } from "express";
import reqLogger from "./middlewares/req_logger.js";
import { errorMiddleware } from "./middlewares/error_handler.js";
// --

const app: Express = express();

app.use(
  cors({ origin: String(process.env["FRONTEND_URL"]), credentials: true }),
);
app.use(express.json());
app.use(reqLogger);

app.get("/", (_, res: Response) => {
  res.end("OK! Response from Server!");
});

app.use(errorMiddleware);

export { app };
