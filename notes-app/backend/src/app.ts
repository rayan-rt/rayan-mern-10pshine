import cors from "cors";
import express, { type Express, type Response } from "express";
import cookieParser from "cookie-parser";
import reqLogger from "./middlewares/req_logger.js";
import { errorMiddleware } from "./middlewares/error_handler.js";
// --

const app: Express = express();

app.use(
  cors({ origin: String(process.env["FRONTEND_URL"]), credentials: true }),
);
app.use(express.json());
app.use(cookieParser());
app.use(reqLogger);

// routes
import { router as userRoutes } from "./routes/user.route.js";
import { router as noteRoutes } from "./routes/note.route.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/notes", noteRoutes);

// --
app.get("/", (_, res: Response) => {
  res.end("OK! Response from Server!");
});

app.use(errorMiddleware);

export { app };
