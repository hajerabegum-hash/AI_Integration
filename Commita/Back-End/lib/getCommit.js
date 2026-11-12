import { Octokit } from "octokit";

const octokit = new Octokit();

export default async function getCommits(githubURL) {
  // https://github.com/ZayeemMohd/small-test
  // [https, /, github.com, ZayeemMohd, small-test]

  const [owner, repo] = githubURL.split("/").slice(-2);

  // commits fetch
  const { data } = await octokit.rest.repos.listCommits({
    owner: owner,
    repo: repo,
  });

  // return commits
  //   console.log(data);
  return data;
}

// getCommits("https://github.com/ZayeemMohd/small-test");
