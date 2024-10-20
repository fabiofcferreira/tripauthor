import { readFileSync } from "fs";
import { writeFileSync } from "node:fs";

export function isCommitOnGoing(filePath: string) {
  try {
    readFileSync(filePath);
    return true;
  } catch {
    return false;
  }
}

export function updateCommitMessageWithCoAuthors(
  commitMessageFile: string,
  coAuthors: string[],
) {
  try {
    const currentCommit = readFileSync(commitMessageFile, "utf8");

    const coAuthorsLines = coAuthors.map(
      (coauthor) => `Co-authored-by: ${coauthor}`,
    );

    const newCommitPayload = currentCommit + "\n\n" + coAuthorsLines.join("\n");
    writeFileSync(commitMessageFile, newCommitPayload, "utf8");
  } catch (e) {
    throw new Error(
      `Error updating commit message with selected co-authors: ${e}`,
    );
  }
}
