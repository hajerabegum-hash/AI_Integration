import mongoose from "mongoose";

const summaryHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    githubURL: {
      type: String,
      required: true,
    },
    finalSummaryArray: {
      type: [
        {
          summary: String,
          commitHash: String,
          commitMessage: String,
          commitAuthorName: String,
          commitAuthorImg: String,
          commitDate: String,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const SummaryHistory =
  mongoose.models.SummaryHistory ||
  mongoose.model("SummaryHistory", summaryHistorySchema);

export default SummaryHistory;
