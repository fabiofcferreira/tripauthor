#!/usr/bin/env node

import yargs from "yargs";
import chalk from "chalk";
import { hideBin } from "yargs/helpers";
import { loadGitKnownCoAuthors, USER_HOME_DIR } from "./config";
import { getSelectedCoauthors } from "./prompts";
import { isCommitOnGoing, updateCommitMessageWithCoAuthors } from "./commit";
import packageBundleJson from "../package.json";

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
  .version(packageBundleJson.version)
  .parseSync();

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

  const knownCoAuthors = loadGitKnownCoAuthors(coAuthorsFile);

  const authorsList = await getSelectedCoauthors(knownCoAuthors);
  if (!authorsList) {
    console.info(chalk.green("🧑‍💻 No co-authors selected!"));
    return;
  }

  updateCommitMessageWithCoAuthors(commitFile, authorsList);
  console.log(chalk.green("🚀 Co-authors added to the commit!"));
}
