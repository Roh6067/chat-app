import express from "express";
import dotenv from "dotenv";
import path from "path";
import connectDB from "../src/lib/db.js";
import { ENV } from "./lib/env.js";

import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messageRoutes.js";

await connectDB();

const app = express();
const PORT = ENV.PORT || 3000;

const __dirname = path.resolve();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// 🚀 ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
