export default async function generateDiff(githubURL, commitHash) {
  const response = await fetch(`${githubURL}/commit/${commitHash}.diff`);
  const diff = await response.text();

  //   console.log(diff);
  return diff;
}

// generateDiff("https://github.com/ZayeemMohd/small-test", "e0fc6c63a5a5bd8a1f92beeac8109aa758286d41");
