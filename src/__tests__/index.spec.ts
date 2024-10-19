import { helloWorld } from "..";

describe("Hello world", () => {
  it("Should return 'Hello, world!'", () => {
    expect(helloWorld()).toBe("Hello, world!");
  });
});
