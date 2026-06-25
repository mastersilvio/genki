import { describe, expect, test } from "bun:test";
import { sanitize } from "./index";

describe("sanitize", () => {
  test("remove segredos de objetos aninhados", () => {
    expect(
      sanitize({ password: "secret", nested: { token: "abc", safe: 1 } }),
    ).toEqual({
      password: "[REDACTED]",
      nested: { token: "[REDACTED]", safe: 1 },
    });
  });
});
