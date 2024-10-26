#!/usr/bin/env node

import yargs from "yargs";
import chalk from "chalk";
import { hideBin } from "yargs/helpers";
import {
  addCoauthorToConfig,
  listConfiguredCoAuthors,
  readGitKnownCoAuthors,
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
  if (!isCommitOnGoing(commitFile)) {
    console.info(chalk.red("No commit is ongoing"));
    process.exit(0);
  }

  const knownCoAuthors = readGitKnownCoAuthors(coAuthorsFile);
  if (!knownCoAuthors.length) {
    console.info(
      chalk.yellow(
        `No co-authors configured in the config file (${coAuthorsFile}!`,
      ),
    );
    return;
  }

  const authorsList = await getSelectedCoauthors(knownCoAuthors);
  if (!authorsList) {
    console.info(chalk.green("🧑‍💻 No co-authors selected!"));
    return;
  }

  updateCommitMessageWithCoAuthors(commitFile, authorsList);
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
      })
        .then(() => {
          console.info(chalk.green("🚀 Co-authors added to the commit!"));
        })
        .catch((e) => {
          console.error(
            chalk.red(`🚒 Failed to add co-authors to the commit: ${e}`),
          );
        });
    },
  )
  .command({
    command: "add-coauthor <name> <email>",
    describe: "Add coauthor to the coauthors file",
    aliases: ["add", "a"],
    builder: {
      coAuthorsFile: {
        alias: "co-authors-file",
        describe: "Co-authors file path",
        type: "string",
        default: `${USER_HOME_DIR}/.git_coauthors`,
      },
    },
    handler: (args) => {
      try {
        addCoauthorToConfig({
          name: args.name,
          email: args.email,
          coAuthorsFile: args.coAuthorsFile,
        });
      } catch (e) {
        console.error(
          chalk.red(`🚒 Failed to add co-author to the config file: ${e}`),
        );
      }
    },
  })
  .command({
    command: "list-coauthors",
    describe: "List all configured coauthors",
    aliases: ["list", "l"],
    builder: {
      coAuthorsFile: {
        alias: "co-authors-file",
        describe: "Co-authors file path",
        type: "string",
        default: `${USER_HOME_DIR}/.git_coauthors`,
      },
    },
    handler: (args) => {
      try {
        listConfiguredCoAuthors(args.coAuthorsFile);
      } catch (e) {
        console.error(chalk.red(`🚒 Failed to read the config file: ${e}`));
      }
    },
  })
  .version(packageBundleJson.version)
  .parseSync();
