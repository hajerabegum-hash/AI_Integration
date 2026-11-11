import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import quizRoutes from "./src/routes/quizRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartStep API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.get("/quiz/:topic", async (req, res) => {
  const { topic } = req.params;
  const count = Number(req.query.count) || 5;

  console.log("Topic received from the client------->", topic);
  console.log("Requested question count------->", count);
  const quizArr = await (
    await import("./lib/gemini.js")
  ).generateQuiz(topic, count);

  console.log("Quiz generated successfully:: ", quizArr);
  res.json({
    message: "Quiz generated successfully",
    data: quizArr,
  });
});

const startServer = async () => {
  try {
    await connectDB().catch((error) => {
      console.warn(
        "MongoDB unavailable. Continuing without database connection:",
        error.message,
      );
    });

    app.listen(PORT, () => {
      console.log(`SmartStep API is running on port ${PORT}`);
      console.log("MongoDB connected successfully");
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1);
  }
};

startServer();
