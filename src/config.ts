import { homedir } from "os";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import chalk from "chalk";

export const USER_HOME_DIR = homedir();

const COAUTHOR_LINE_REGEX = new RegExp(/^([\w\sÀ-ž-.]+)\s<([\w.-]+@[\w.]+)>$/);

export type CoAuthor = {
  displayName: string;
  name: string;
  email: string;
};

export const isCoAuthorDisplayNameValid = (line: string) =>
  COAUTHOR_LINE_REGEX.test(line);

export function readGitKnownCoAuthors(filePath: string): CoAuthor[] {
  if (!existsSync(filePath)) {
    console.info(chalk.yellow(`Co-authors file not found at ${filePath}`));
    return [];
  }

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

export function updateGitKnownCoAuthors(
  filePath: string,
  coAuthors: CoAuthor[],
): boolean {
  try {
    const contents = coAuthors
      .filter((coAuthor) => isCoAuthorDisplayNameValid(coAuthor.displayName))
      .map((coAuthor) => coAuthor.displayName)
      .join("\n");
    writeFileSync(filePath, contents, "utf8");
    return true;
  } catch (ex) {
    throw new Error(`Error parsing co-authors from file ${filePath}: ${ex}`);
  }
}

export type AddCoauthorsToConfigParams = {
  name: string;
  email: string;
  coAuthorsFile: string;
};

export function addCoauthorToConfig({
  name,
  email,
  coAuthorsFile,
}: AddCoauthorsToConfigParams) {
  const coAuthorDisplayName = `${name} <${email}>`;
  if (!isCoAuthorDisplayNameValid(coAuthorDisplayName)) {
    throw new Error(
      "Invalid co-author configuration. Expected format: 'Name <email>'",
    );
  }

  const knownCoAuthors = readGitKnownCoAuthors(coAuthorsFile);
  knownCoAuthors.push({
    displayName: coAuthorDisplayName,
    name,
    email,
  });

  updateGitKnownCoAuthors(coAuthorsFile, knownCoAuthors);
  console.info(chalk.green("✅ Co-author added to the config file!"));
}

export function listConfiguredCoAuthors(coAuthorsFile: string) {
  const knownCoAuthors = readGitKnownCoAuthors(coAuthorsFile);
  if (!knownCoAuthors.length) {
    console.info(chalk.yellow(`There are no co-authors configured`));
    return;
  }

  const coAuthorsList = knownCoAuthors
    .map(
      (coAuthor, index) =>
        `${index + 1}. Name: ${chalk.cyan(coAuthor.name)} | Email: ${chalk.green(coAuthor.email)}`,
    )
    .join("\n");

  console.info(
    `There are ${chalk.green(knownCoAuthors.length)} co-authors configured:\n${coAuthorsList}`,
  );
}
