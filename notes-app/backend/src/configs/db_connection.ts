import { connect } from "mongoose";
import { exit } from "process";
// --

const MONGODB_URI: string = String(process.env["MONGODB_URI"]);

async function connectToDB() {
  try {
    console.log("Connecting to MongoDB...");
    const { connection } = await connect(MONGODB_URI, {
      dbName: "notes-app-10pshine",
    });
    console.log(`MongoDB connected: ${connection.host}`);
  } catch (error) {
    console.error(error);
    throw error;
    exit(1);
  }
}

export { connectToDB };
