"""Importador sintético usado somente em desenvolvimento e testes."""

from collections.abc import Iterator

from importer import (
    CanonicalRecord,
    ImportInspection,
    RawRecord,
    SourceFile,
    ValidationResult,
)


class MockImporter:
    name = "mock-json-importer"
    version = "1.0.0"

    def supports(self, source_file: SourceFile) -> bool:
        return source_file.media_type == "application/json"

    def inspect(self, source_file: SourceFile) -> ImportInspection:
        return ImportInspection(self.supports(source_file), 1)

    def parse(self, source_file: SourceFile) -> Iterator[RawRecord]:
        del source_file
        yield RawRecord(
            "measurement",
            {
                "metric_code": "weight",
                "value": "78.4",
                "unit_code": "kg",
                "measured_at": "2026-06-25T10:00:00Z",
            },
        )

    def normalize(self, record: RawRecord) -> CanonicalRecord:
        payload = record.payload
        return CanonicalRecord(
            metric_code=str(payload["metric_code"]),
            value=str(payload["value"]),
            unit_code=str(payload["unit_code"]),
            measured_at=str(payload["measured_at"]),
            raw_payload=payload,
        )

    def validate(self, record: CanonicalRecord) -> ValidationResult:
        try:
            float(record.value)
        except ValueError:
            return ValidationResult(False, ("value must be numeric",))
        return ValidationResult(True)

