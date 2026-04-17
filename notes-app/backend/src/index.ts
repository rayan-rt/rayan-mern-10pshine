import "dotenv/config";
import { app } from "./app.js";
import { connectToDB } from "./configs/db_connection.js";
// --

const PORT: number = Number(process.env["PORT"] || 8000);

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
