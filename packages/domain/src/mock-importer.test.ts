import { describe, expect, test } from "bun:test";
import { MockImporter } from "./mock-importer";

describe("MockImporter", () => {
  test("inspeciona, normaliza e valida um arquivo sintético", async () => {
    const importer = new MockImporter();
    const source = {
      path: "/tmp/mock.json",
      mediaType: "application/json",
      checksum: "abc",
    };
    const inspection = await importer.inspect(source);
    const records = [];
    for await (const record of importer.parse(source)) records.push(record);
    const firstRecord = records[0];
    if (!firstRecord) throw new Error("O importador não produziu registros.");
    const normalized = importer.normalize(firstRecord);

    expect(inspection.supported).toBe(true);
    expect(importer.validate(normalized).valid).toBe(true);
  });
});
