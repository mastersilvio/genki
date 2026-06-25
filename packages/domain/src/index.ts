export type CanonicalSourceType =
  | "measured"
  | "estimated"
  | "calculated"
  | "manual"
  | "file"
  | "clinical";

export interface CanonicalMeasurement {
  externalId?: string;
  metricCode: string;
  value: string;
  originalValue: string;
  unitCode: string;
  originalUnitCode: string;
  measuredAt: Date;
  sourceType: CanonicalSourceType;
  rawPayload?: unknown;
}

export interface ProviderContext {
  userId: string;
  connectionId?: string;
}

export interface ProviderDevice {
  externalId: string;
  manufacturer: string;
  model: string;
  deviceType: string;
}

export interface MeasurementSyncRequest {
  context: ProviderContext;
  from?: Date;
  to?: Date;
}

export interface MeasurementSyncResult {
  measurements: CanonicalMeasurement[];
  cursor?: string;
}

export interface HealthDataProvider {
  readonly code: string;
  discoverDevices?(context: ProviderContext): Promise<ProviderDevice[]>;
  syncMeasurements?(
    request: MeasurementSyncRequest,
  ): Promise<MeasurementSyncResult>;
}

export interface ImportSourceFile {
  path: string;
  mediaType: string;
  checksum: string;
}

export interface ImportInspection {
  supported: boolean;
  estimatedRecords: number;
}

export interface RawRecord {
  type: string;
  payload: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface HealthDataImporter {
  readonly name: string;
  readonly version: string;
  supports(sourceFile: ImportSourceFile): boolean;
  inspect(sourceFile: ImportSourceFile): Promise<ImportInspection>;
  parse(sourceFile: ImportSourceFile): AsyncIterable<RawRecord>;
  normalize(record: RawRecord): CanonicalMeasurement;
  validate(record: CanonicalMeasurement): ValidationResult;
}
