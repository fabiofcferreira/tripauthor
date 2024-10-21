import {
  getCurrentCommitMessage,
  isCommitOnGoing,
  updateCommitMessageWithCoAuthors,
} from "../commit";
import * as fs from "node:fs";

const DEFAULT_COMMIT_MESSAGE_FILE = "./.git/COMMIT_EDITMSG";
const DEFAULT_COMMIT_TITLE = "feat: default commit message";

jest.mock("node:fs", () => ({
  ...jest.requireActual("node:fs"),
  readFileSync: jest.fn().mockImplementation(() => DEFAULT_COMMIT_TITLE),
  writeFileSync: jest.fn(),
}));

describe("Commit logic", () => {
  it("detects commit is ongoing", () => {
    expect(isCommitOnGoing(DEFAULT_COMMIT_MESSAGE_FILE)).toBe(true);

    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
      throw new Error("Random error");
    });
    expect(isCommitOnGoing(DEFAULT_COMMIT_MESSAGE_FILE)).toBe(false);
  });

  it("should get current commit message", () => {
    expect(getCurrentCommitMessage(DEFAULT_COMMIT_MESSAGE_FILE)).toBe(
      DEFAULT_COMMIT_TITLE,
    );
  });

  it("should fail to get current commit message if there is no commit message file", () => {
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
      throw new Error("Could not find file");
    });

    expect(() =>
      getCurrentCommitMessage(DEFAULT_COMMIT_MESSAGE_FILE),
    ).toThrow();
  });

  it("should add co-authors to commit message", () => {
    let writeFileSpy = jest.spyOn(fs, "writeFileSync");
    writeFileSpy.mockImplementation(jest.fn());

    updateCommitMessageWithCoAuthors(DEFAULT_COMMIT_MESSAGE_FILE, [
      "Marie Jane <mjane@google.com>",
    ]);

    expect(writeFileSpy).toHaveBeenCalledWith(
      DEFAULT_COMMIT_MESSAGE_FILE,
      `feat: default commit message\n\nCo-authored-by: Marie Jane <mjane@google.com>`,
      "utf8",
    );
  });
});
