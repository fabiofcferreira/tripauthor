import { homedir } from "os";
import { readFileSync } from "fs";

export const USER_HOME_DIR = homedir();

const COAUTHOR_LINE_REGEX = new RegExp(/^([\w\s-.]+)\s<([\w.-]+@[\w.]+)>$/);

export type CoAuthor = {
  displayName: string;
  name: string;
  email: string;
};

export function loadGitKnownCoAuthors(filePath: string): CoAuthor[] {
  try {
    const knownAuthors = readFileSync(filePath, "utf8");
    const lines = knownAuthors.split("\n");

    const coauthors: CoAuthor[] = [];
    lines.forEach((displayName) => {
      const regexResult = displayName.match(COAUTHOR_LINE_REGEX);
      if (!regexResult || regexResult.length !== 3) {
        return;
      }

      coauthors.push({
        displayName: displayName,
        name: regexResult[1],
        email: regexResult[2],
      });
    });

    return coauthors;
  } catch (ex) {
    throw new Error(`Error parsing co-authors from file ${filePath}: ${ex}`);
  }
}
