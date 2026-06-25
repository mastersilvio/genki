"""Contratos de importação independentes de fabricante."""

from collections.abc import Iterator
from dataclasses import dataclass
from typing import Any, Protocol


@dataclass(frozen=True)
class SourceFile:
    path: str
    media_type: str
    checksum: str


@dataclass(frozen=True)
class ImportInspection:
    supported: bool
    estimated_records: int


@dataclass(frozen=True)
class RawRecord:
    record_type: str
    payload: dict[str, Any]


@dataclass(frozen=True)
class CanonicalRecord:
    metric_code: str
    value: str
    unit_code: str
    measured_at: str
    raw_payload: dict[str, Any]


@dataclass(frozen=True)
class ValidationResult:
    valid: bool
    errors: tuple[str, ...] = ()


class HealthDataImporter(Protocol):
    name: str
    version: str

    def supports(self, source_file: SourceFile) -> bool: ...

    def inspect(self, source_file: SourceFile) -> ImportInspection: ...

    def parse(self, source_file: SourceFile) -> Iterator[RawRecord]: ...

    def normalize(self, record: RawRecord) -> CanonicalRecord: ...

    def validate(self, record: CanonicalRecord) -> ValidationResult: ...

