import { describe, expect, test } from "bun:test";
import { createApp } from "./app";

describe("system routes", () => {
  test("health retorna contrato padronizado e request id", async () => {
    const response = await createApp().handle(
      new Request("http://localhost/api/v1/health", {
        headers: { "x-request-id": "test-request-id" },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("x-request-id")).toBe("test-request-id");
    expect(body.data.status).toBe("ok");
    expect(body.meta.requestId).toBe("test-request-id");
  });

  test("version informa as fases implementadas", async () => {
    const response = await createApp().handle(
      new Request("http://localhost/api/v1/version"),
    );
    const body = await response.json();
    expect(body.data.phases).toEqual([0, 1]);
  });
});
