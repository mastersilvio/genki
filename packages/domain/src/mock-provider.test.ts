import { describe, expect, test } from "bun:test";
import { MockProvider } from "./mock-provider";

describe("MockProvider", () => {
  test("produz dados canônicos e sintéticos", async () => {
    const provider = new MockProvider();
    const result = await provider.syncMeasurements({
      context: { userId: "user-1" },
      to: new Date("2026-06-25T12:00:00Z"),
    });

    expect(provider.code).toBe("mock");
    expect(result.measurements[0]?.metricCode).toBe("steps");
    expect(result.measurements[0]?.rawPayload).toEqual({ synthetic: true });
  });
});
