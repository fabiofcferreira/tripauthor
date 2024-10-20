import { loadGitKnownCoAuthors } from "../config";
import { homedir } from "os";
import * as fs from "node:fs";

jest.mock("node:fs");

export const MOCKED_COAUTHORS_FILE_CONTENT = `
John Doe <johndoe@microsoft.com>
Marie Jane <mjane@google.com>
invalid author <wefwefwefwefwe>

 <jhjafhsdf@>
`;

describe("Config load", () => {
  it("should load only valid coauthors", () => {
    jest
      .spyOn(fs, "readFileSync")
      .mockReturnValueOnce(MOCKED_COAUTHORS_FILE_CONTENT);

    const coauthors = loadGitKnownCoAuthors(`${homedir()}/.git_coauthors`);
    expect(coauthors).toHaveLength(2);

    expect(coauthors[0].displayName).toBe("John Doe <johndoe@microsoft.com>");
    expect(coauthors[0].name).toBe("John Doe");
    expect(coauthors[0].email).toBe("johndoe@microsoft.com");

    expect(coauthors[1].displayName).toBe("Marie Jane <mjane@google.com>");
    expect(coauthors[1].name).toBe("Marie Jane");
    expect(coauthors[1].email).toBe("mjane@google.com");
  });

  it("should fail to load if file cannot be found", () => {
    jest.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("Random error");
    });

    expect(() =>
      loadGitKnownCoAuthors(`${homedir()}/.git_coauthors`),
    ).toThrow();
  });
});
