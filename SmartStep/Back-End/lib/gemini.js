import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

const fallbackQuiz = (topic, count = 5) => {
  const baseQuestions = [
    {
      question: `What is ${topic}?`,
      options: [
        "A framework",
        "A database",
        "An operating system",
        "A browser",
      ],
      correctAnswer: "A framework",
    },
    {
      question: `Which option best describes ${topic}?`,
      options: ["A language", "A tool", "A library", "A design pattern"],
      correctAnswer: "A tool",
    },
    {
      question: `Why is ${topic} commonly used?`,
      options: [
        "To style text",
        "To build interfaces",
        "To store files",
        "To manage memory",
      ],
      correctAnswer: "To build interfaces",
    },
    {
      question: `Which is a key benefit of ${topic}?`,
      options: [
        "Faster hardware",
        "Simpler development",
        "More security",
        "Better battery life",
      ],
      correctAnswer: "Simpler development",
    },
    {
      question: `What should you do before using ${topic}?`,
      options: [
        "Restart the computer",
        "Understand the basics",
        "Delete the code",
        "Change the OS",
      ],
      correctAnswer: "Understand the basics",
    },
  ];

  const result = [];
  for (let i = 0; i < count; i += 1) {
    const template = baseQuestions[i % baseQuestions.length];
    result.push({
      question: template.question,
      options: [...template.options],
      correctAnswer: template.correctAnswer,
    });
  }

  return result;
};

const normalizeQuiz = (quiz, count) => {
  const source = Array.isArray(quiz)
    ? quiz
    : Array.isArray(quiz?.questions)
      ? quiz.questions
      : [];

  const normalized = source
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      question: String(item.question || "Untitled question"),
      options: Array.isArray(item.options) ? item.options.slice(0, 4) : [],
      correctAnswer: String(item.correctAnswer || item.options?.[0] || ""),
    }))
    .filter((item) => item.question && item.options.length >= 2);

  if (normalized.length >= count) {
    return normalized.slice(0, count);
  }

  const padded = [...normalized];
  while (padded.length < count) {
    const extra = fallbackQuiz("General Knowledge", 1)[0];
    padded.push(extra);
  }

  return padded.slice(0, count);
};

export const generateQuiz = async (topic, count = 5) => {
  const safeCount = Math.max(1, Math.min(100, Number(count) || 5));
  const systemPrompt = `Generate a quiz with exactly ${safeCount} questions about ${topic}. Each question must have 4 multiple-choice options and one correct answer. Return valid JSON only. The JSON can be an array of objects or an object with a questions array.`;

  if (!ai) {
    console.log("No Gemini API key found. Returning fallback quiz data.");
    return fallbackQuiz(topic, safeCount);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: systemPrompt,
    });

    const quizPayload = JSON.parse(response.text || "[]");
    console.log("Data from AI:------>", quizPayload);

    return normalizeQuiz(quizPayload, safeCount);
  } catch (error) {
    console.error("Gemini quiz generation failed:", error.message);
    return fallbackQuiz(topic, safeCount);
  }
};
