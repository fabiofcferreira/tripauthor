import { readGitKnownCoAuthors, updateGitKnownCoAuthors } from "../config";
import { homedir } from "os";
import * as fs from "node:fs";

jest.mock("node:fs");

export const MOCKED_COAUTHORS_FILE_CONTENT = `
John Doe <johndoe@microsoft.com>
Marie Jane <mjane@google.com>
invalid author <wefwefwefwefwe>

 <jhjafhsdf@>
`;

const DEFAULT_COAUTHORS_CONFIG_FILE_PATH = `${homedir()}/.git_coauthors`;

describe("Config load", () => {
  it("should read & load only valid coauthors from config file", () => {
    jest.spyOn(fs, "existsSync").mockReturnValueOnce(true);
    jest
      .spyOn(fs, "readFileSync")
      .mockReturnValueOnce(MOCKED_COAUTHORS_FILE_CONTENT);

    const coauthors = readGitKnownCoAuthors(DEFAULT_COAUTHORS_CONFIG_FILE_PATH);
    expect(coauthors).toHaveLength(2);

    expect(coauthors[0].displayName).toBe("John Doe <johndoe@microsoft.com>");
    expect(coauthors[0].name).toBe("John Doe");
    expect(coauthors[0].email).toBe("johndoe@microsoft.com");

    expect(coauthors[1].displayName).toBe("Marie Jane <mjane@google.com>");
    expect(coauthors[1].name).toBe("Marie Jane");
    expect(coauthors[1].email).toBe("mjane@google.com");
  });

  it("should return empty array if config file cannot be found", () => {
    jest.spyOn(fs, "existsSync").mockReturnValueOnce(false);

    const knownCoAuthors = readGitKnownCoAuthors(
      DEFAULT_COAUTHORS_CONFIG_FILE_PATH,
    );
    expect(knownCoAuthors).toHaveLength(0);
  });

  it("should fail if config file cannot be parsed", () => {
    jest.spyOn(fs, "existsSync").mockReturnValueOnce(true);
    jest.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("Could not read config file");
    });

    expect(() =>
      readGitKnownCoAuthors(DEFAULT_COAUTHORS_CONFIG_FILE_PATH),
    ).toThrow();
  });

  it("should write only valid coauthors to config file", () => {
    const writeSpy = jest.spyOn(fs, "writeFileSync");
    writeSpy.mockImplementation(jest.fn());

    const result = updateGitKnownCoAuthors(DEFAULT_COAUTHORS_CONFIG_FILE_PATH, [
      {
        displayName: "Jane Doe <jdoe@gmail.com>",
        name: "Jane Doe",
        email: "jdoe@gmail.com",
      },
      {
        displayName: "John Doe <invalidemailaddress>,",
        name: "John Doe",
        email: "invalidemailaddress",
      },
    ]);

    expect(result).toBe(true);
    expect(writeSpy).toHaveBeenCalledWith(
      DEFAULT_COAUTHORS_CONFIG_FILE_PATH,
      `Jane Doe <jdoe@gmail.com>`,
      "utf8",
    );
  });

  it("should fail to write coauthors to config file if it is not found", () => {
    const writeSpy = jest.spyOn(fs, "writeFileSync");

    writeSpy.mockImplementation(
      jest.fn(() => {
        throw new Error("File not found");
      }),
    );

    expect(() =>
      updateGitKnownCoAuthors(DEFAULT_COAUTHORS_CONFIG_FILE_PATH, [
        {
          displayName: "Jane Doe <jdoe@gmail.com>",
          name: "Jane Doe",
          email: "jdoe@gmail.com",
        },
      ]),
    ).toThrow();
  });
});
