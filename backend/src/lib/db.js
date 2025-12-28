import mongoose from "mongoose";
// import "dotenv/config";
import { ENV } from "./env.js";

 export const connectDB = async () => {
  try {
    const{ MONGODB_URI } = ENV;
    if(!MONGODB_URI) throw new Error("MONGODB_URI is not defined in environment variables");
    const conn =await mongoose.connect(ENV.MONGODB_URI);
    console.log("✅ MongoDB Connected", conn.connection.host);

  } catch (error) {
    console.error(`✖️ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
