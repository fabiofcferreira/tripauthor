import { readFileSync, writeFileSync } from "node:fs";

export function isCommitOnGoing(filePath: string) {
  try {
    readFileSync(filePath);
    return true;
  } catch {
    return false;
  }
}

export function getCurrentCommitMessage(commitMessageFile: string) {
  try {
    return readFileSync(commitMessageFile, "utf8");
  } catch (e) {
    throw new Error(`Error reading current commit message: ${e}`);
  }
}

export function updateCommitMessageWithCoAuthors(
  commitMessageFile: string,
  coAuthors: string[],
) {
  try {
    const currentCommitBody = getCurrentCommitMessage(commitMessageFile);

    const coAuthorsLines = coAuthors.map(
      (coauthor) => `Co-authored-by: ${coauthor}`,
    );

    const newCommitPayload =
      currentCommitBody + "\n\n" + coAuthorsLines.join("\n");
    writeFileSync(commitMessageFile, newCommitPayload, "utf8");
  } catch (e) {
    throw new Error(
      `Error updating commit message with selected co-authors: ${e}`,
    );
  }
}
