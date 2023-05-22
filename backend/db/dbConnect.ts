import * as mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

async function dbConnect() {
  const dbUrl = process.env.DB_URL;

  if (!dbUrl) {
    console.log("Missing database URL!");
    return;
  }

  try {
    await (mongoose as mongoose.AnyObject).default.connect(dbUrl);

    console.log("Connected to MongoDB Atlas!");
  } catch (error) {
    console.log("Connection to MongoDB Atlas failed!");
    console.error(error);
  }
}

export default dbConnect;
