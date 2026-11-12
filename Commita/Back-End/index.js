import genAISummary from "./lib/genAiSummary.js";
import generateDiff from "./lib/generateDiff.js";
import getCommits from "./lib/getCommit.js";

export async function main(githubURL) {
  const commitsArray = await getCommits(githubURL);
  console.log("Commits for GithubURL fetched successfully...");

  const diffArrayPromise = commitsArray.map(async (commitObj, index) => {
    console.log("Generating Diff for commit:", index);
    const diff = await generateDiff(githubURL, commitObj.sha);
    return diff;
  });

  const finalDiffArray = await Promise.all(diffArrayPromise);

  const summaryArrayPromise = finalDiffArray.map(async (diffString, index) => {
    console.log("Generating summary for commit:", index);
    const summary = await genAISummary(diffString);
    return summary;
  });

  const finalSummaryArray = await Promise.all(summaryArrayPromise);
  console.log("Summary array generated", finalSummaryArray.length);

  const finalDataArray = finalSummaryArray.map((summaryText, index) => ({
    summary: summaryText,
    commitHash: commitsArray[index]?.sha,
    commitMessage: commitsArray[index]?.commit?.message,
    commitAuthorName: commitsArray[index]?.commit?.author?.name,
    commitAuthorImg: commitsArray[index]?.author?.avatar_url,
    commitDate: commitsArray[index]?.commit?.author?.date,
  }));

  return finalDataArray;
}
