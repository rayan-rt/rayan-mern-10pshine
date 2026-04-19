import cors from "cors";
import express, { type Express, type Response } from "express";
// --

const app: Express = express();

app.use(
  cors({ origin: String(process.env["FRONTEND_URL"]), credentials: true }),
);
app.use(express.json());

app.get("/", (_, res: Response) => {
  res.end("OK! Response from Server!");
});

export { app };
