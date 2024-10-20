import * as fs from "node:fs";
import * as commit from "../commit";

jest.mock("node:fs", () => ({
  ...jest.requireActual("node:fs"),
  readFileSync: jest.fn(() => "feat: default commit message"),
  writeFileSync: jest.fn(),
}));

jest.mock("../commit", () => ({
  ...jest.requireActual("../commit"),
  getCurrentCommitMessage: jest.fn(),
}));

describe("Commit logic", () => {
  it("detects commit is ongoing", () => {
    expect(commit.isCommitOnGoing("./.git/COMMIT_EDITMSG")).toBe(true);

    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
      throw new Error("Could not find file");
    });
    expect(commit.isCommitOnGoing("./.git/COMMIT_EDITMSG")).toBe(false);
  });

  it("should add co-authors to commit message", () => {
    let writeFileSpy = jest.fn();
    jest.spyOn(fs, "writeFileSync").mockImplementation(writeFileSpy);

    commit.updateCommitMessageWithCoAuthors("./.git/COMMIT_EDITMSG", [
      "Marie Jane <mjane@google.com>",
    ]);

    expect(writeFileSpy).toHaveBeenCalledWith(
      "./.git/COMMIT_EDITMSG",
      `feat: default commit message\n\nCo-authored-by: Marie Jane <mjane@google.com>`,
      "utf8",
    );
  });
});
