import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import SummaryHistory from "../models/SummaryHistory.js";
import { main as generateSummaryPipeline } from "../index.js";

const router = express.Router();

function normalizeGitHubUrl(rawUrl = "") {
  const url = rawUrl.trim();

  if (!url) {
    return "";
  }

  const sanitized = url.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  const withoutTrailingSlash = sanitized.replace(/\/+$/, "");

  if (!withoutTrailingSlash.startsWith("github.com/")) {
    return `https://${withoutTrailingSlash}`;
  }

  return `https://${withoutTrailingSlash}`;
}

function buildFallbackSummary(githubURL) {
  return [
    {
      summary: `Unable to generate AI summary for ${githubURL}. Please verify the GitHub repo URL and Gemini API key.`,
      commitHash: null,
      commitMessage: "Summary generation failed",
      commitAuthorName: null,
      commitAuthorImg: null,
      commitDate: null,
    },
  ];
}

router.use(authMiddleware);

router.post("/generate", async (req, res) => {
  try {
    const { githubURL } = req.body || {};

    if (!githubURL) {
      return res.status(400).json({ msg: "githubURL is required" });
    }

    const normalizedGithubURL = normalizeGitHubUrl(githubURL);

    let finalSummaryArray;
    try {
      finalSummaryArray = await generateSummaryPipeline(normalizedGithubURL);
    } catch (error) {
      console.error("AI summary generation failed:", error);
      finalSummaryArray = buildFallbackSummary(normalizedGithubURL);
    }

    const savedHistory = await SummaryHistory.create({
      userId: req.user.id,
      username: req.user.username,
      githubURL: normalizedGithubURL,
      finalSummaryArray,
    });

    return res.status(200).json({
      githubURL: normalizedGithubURL,
      finalSummaryArray,
      savedHistoryId: savedHistory._id,
      warning: finalSummaryArray[0]?.summary?.startsWith(
        "Unable to generate AI summary",
      )
        ? "Summary generation failed. History was still saved so you can inspect the record."
        : undefined,
    });
  } catch (error) {
    console.error("generate summary error:", error);
    return res.status(500).json({ msg: "Failed to generate summary" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await SummaryHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ history });
  } catch (error) {
    console.error("history error:", error);
    return res.status(500).json({ msg: "Failed to fetch history" });
  }
});

export default router;
