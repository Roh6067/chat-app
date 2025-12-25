import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 ES Module me __dirname banane ka sahi tarika
const __dirname = path.resolve();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// 🚀 ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
