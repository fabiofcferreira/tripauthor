#!/usr/bin/env node

import yargs from "yargs";
import chalk from "chalk";
import { hideBin } from "yargs/helpers";
import {
  isCoAuthorDisplayNameValid,
  readGitKnownCoAuthors,
  updateGitKnownCoAuthors,
  USER_HOME_DIR,
} from "./config";
import { getSelectedCoauthors } from "./prompts";
import { isCommitOnGoing, updateCommitMessageWithCoAuthors } from "./commit";
import packageBundleJson from "../package.json";

async function runCoCommitFlow({
  commitFile,
  coAuthorsFile,
}: {
  commitFile: string;
  coAuthorsFile: string;
}) {
  try {
    if (!isCommitOnGoing(commitFile)) {
      console.info(chalk.red("No commit is ongoing"));
      process.exit(0);
    }

    const knownCoAuthors = readGitKnownCoAuthors(coAuthorsFile);

    const authorsList = await getSelectedCoauthors(knownCoAuthors);
    if (!authorsList) {
      console.info(chalk.green("🧑‍💻 No co-authors selected!"));
      return;
    }

    updateCommitMessageWithCoAuthors(commitFile, authorsList);
    console.info(chalk.green("🚀 Co-authors added to the commit!"));
  } catch (e) {
    console.error(chalk.red(`🚒 Failed to add co-authors to the commit: ${e}`));
  }
}

function addCoauthorToConfig({
  name,
  email,
  coAuthorsFile,
}: {
  name: string;
  email: string;
  coAuthorsFile: string;
}) {
  try {
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
  } catch (e) {
    console.error(
      chalk.red(`🚒 Failed to add co-author to the config file: ${e}`),
    );
  }
}

yargs(hideBin(process.argv))
  .usage("Usage: $0 -f [commit message file]")
  .command(
    "$0",
    "Add co-authors to the ongoing commit",
    {
      f: {
        alias: "file",
        describe: "Commit message file",
        type: "string",
        default: ".git/COMMIT_EDITMSG",
      },
      coAuthorsFile: {
        alias: "co-authors-file",
        describe: "Co-authors file path",
        type: "string",
        default: `${USER_HOME_DIR}/.git_coauthors`,
      },
    },
    (argv) => {
      runCoCommitFlow({
        commitFile: argv.f,
        coAuthorsFile: argv.coAuthorsFile,
      });
    },
  )
  .command({
    command: "add-coauthor",
    describe: "Add coauthor to the coauthors file",
    builder: {
      name: { type: "string", demandOption: true },
      email: { type: "string", demandOption: true },
      coAuthorsFile: {
        alias: "co-authors-file",
        describe: "Co-authors file path",
        type: "string",
        default: `${USER_HOME_DIR}/.git_coauthors`,
      },
    },
    handler: (args) => {
      addCoauthorToConfig({
        name: args.name,
        email: args.email,
        coAuthorsFile: args.coAuthorsFile,
      });
    },
  })
  .version(packageBundleJson.version)
  .parseSync();
