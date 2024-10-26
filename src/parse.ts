import { CoAuthor } from "./config";

const EMAIL_VALIDATION_REGEX = new RegExp(
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
);

export function isEmailValid(emailString: string) {
  return EMAIL_VALIDATION_REGEX.test(emailString);
}

export function isCoAuthorLineValid(line: string) {
  const parts = line.split(" <");
  if (parts.length !== 2) {
    return false;
  }

  const name = parts[0].trim();
  const email = parts[1].replace(">", "").trim();

  return name.length > 1 && email.length > 1 && isEmailValid(email);
}

export function parseCoAuthorLine(line: string): CoAuthor {
  if (!isCoAuthorLineValid(line)) {
    throw new Error(`Invalid co-author configuration entry found: "${line}"`);
  }

  const parts = line.split("<");
  const name = parts[0].trim();
  const email = parts[1].replace(">", "").trim();

  return {
    displayName: line,
    name,
    email,
  };
}
