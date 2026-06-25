import type {
  CanonicalMeasurement,
  HealthDataImporter,
  ImportInspection,
  ImportSourceFile,
  RawRecord,
  ValidationResult,
} from "./index";

export class MockImporter implements HealthDataImporter {
  readonly name = "mock-json-importer";
  readonly version = "1.0.0";

  supports(sourceFile: ImportSourceFile): boolean {
    return sourceFile.mediaType === "application/json";
  }

  async inspect(sourceFile: ImportSourceFile): Promise<ImportInspection> {
    return { supported: this.supports(sourceFile), estimatedRecords: 1 };
  }

  async *parse(_sourceFile: ImportSourceFile): AsyncIterable<RawRecord> {
    yield {
      type: "measurement",
      payload: {
        metricCode: "weight",
        value: "78.4",
        unitCode: "kg",
        measuredAt: "2026-06-25T10:00:00Z",
      },
    };
  }

  normalize(record: RawRecord): CanonicalMeasurement {
    const payload = record.payload as Record<string, string>;
    return {
      metricCode: payload.metricCode ?? "unknown",
      value: payload.value ?? "0",
      originalValue: payload.value ?? "0",
      unitCode: payload.unitCode ?? "unknown",
      originalUnitCode: payload.unitCode ?? "unknown",
      measuredAt: new Date(payload.measuredAt ?? 0),
      sourceType: "file",
      rawPayload: record.payload,
    };
  }

  validate(record: CanonicalMeasurement): ValidationResult {
    const valid =
      record.metricCode !== "unknown" &&
      Number.isFinite(Number(record.value)) &&
      !Number.isNaN(record.measuredAt.valueOf());
    return { valid, errors: valid ? [] : ["Registro canônico inválido"] };
  }
}
