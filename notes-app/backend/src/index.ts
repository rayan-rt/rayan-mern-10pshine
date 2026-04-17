import "dotenv/config";
import { app } from "./app.js";
// --

const PORT: number = Number(process.env["PORT"] || 8000);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
