import enquirer from "enquirer";
import { CoAuthor } from "./config";

/**
 * Prompts the user to select one or more co-authors from a list of available co-authors and returns the list.
 */
export async function getSelectedCoauthors(coAuthors: CoAuthor[]) {
  const result = await enquirer.prompt<{ coauthors: string[] }>({
    type: "multiselect",
    name: "coauthors",
    message:
      "Select co-authors for this commit (use space to select and Enter to submit)",
    choices: coAuthors.map((coauthor) => ({
      name: coauthor.displayName,
    })),
  });

  return result.coauthors;
}
