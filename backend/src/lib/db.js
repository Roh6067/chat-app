import mongoose from "mongoose";
import dotenv from "dotenv";

// load env config
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(`✖️ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
