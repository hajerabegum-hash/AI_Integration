import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import summariesRouter from "./routes/summaries.js";

const app = express();
const port = Number(process.env.PORT || 8080);
const mongoUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/commita";
const jwtSecret = process.env.JWT_SECRET || "dev-secret";

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set. Using a dev fallback value.");
}

if (!process.env.MONGODB_URL) {
  console.warn("MONGODB_URL is not set. Using the local default database.");
}

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/summaries", summariesRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

async function startServer() {
  await mongoose.connect(mongoUrl);
  app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message || error);
  process.exitCode = 1;
});

export { app, jwtSecret };
