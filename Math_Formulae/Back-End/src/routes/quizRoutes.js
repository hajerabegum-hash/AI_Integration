import express from "express";
import { generateQuiz } from "../../lib/gemini.js";
import protect from "../middleware/authMiddleware.js";
import QuizAttempt from "../models/QuizAttempt.js";

const router = express.Router();

const normalizeQuestionList = (questions) => {
  if (!Array.isArray(questions)) return [];
  return questions
    .map((question) => {
      if (!question || typeof question !== "object") {
        return null;
      }

      return {
        question: question.question || "Untitled question",
        options: Array.isArray(question.options) ? question.options : [],
        correctAnswer: question.correctAnswer || "",
      };
    })
    .filter(Boolean);
};

router.post("/generate", protect, async (req, res) => {
  const { topic, difficulty = "medium", count = 5 } = req.body;

  if (!topic || !String(topic).trim()) {
    return res.status(400).json({
      success: false,
      message: "Topic is required.",
    });
  }

  try {
    const quiz = await generateQuiz(
      String(topic),
      String(difficulty),
      Number(count) || 5,
    );
    const questions = normalizeQuestionList(quiz?.questions || quiz || []);

    return res.status(200).json({
      success: true,
      data: {
        topic: String(topic),
        difficulty: String(difficulty),
        questions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate quiz.",
      error: error.message,
    });
  }
});

router.post("/submit", protect, async (req, res) => {
  const {
    topic,
    difficulty = "medium",
    questions = [],
    answers = {},
  } = req.body;

  if (!topic || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Topic and quiz questions are required.",
    });
  }

  try {
    let score = 0;

    const result = questions.map((question) => {
      const selectedAnswer =
        answers[question.question] ?? answers[question._id] ?? null;
      const isCorrect =
        selectedAnswer && selectedAnswer === question.correctAnswer;

      if (isCorrect) {
        score += 1;
      }

      return {
        question: question.question,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: Boolean(isCorrect),
      };
    });

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      topic,
      difficulty,
      score,
      totalQuestions: questions.length,
      answers: result,
    });

    return res.status(200).json({
      success: true,
      data: {
        attemptId: attempt._id,
        topic,
        difficulty,
        score,
        totalQuestions: questions.length,
        result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz.",
      error: error.message,
    });
  }
});

router.get("/history", protect, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load history.",
      error: error.message,
    });
  }
});

export default router;
