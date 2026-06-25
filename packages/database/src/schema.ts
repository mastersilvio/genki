import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    birthDate: date("birth_date"),
    timezone: text("timezone").notNull().default("America/Sao_Paulo"),
    locale: text("locale").notNull().default("pt-BR"),
    preferredUnitSystem: text("preferred_unit_system")
      .notNull()
      .default("metric"),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (table) => [uniqueIndex("users_email_idx").on(table.email)],
);

export const providers = pgTable(
  "providers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    providerType: text("provider_type").notNull(),
    integrationType: text("integration_type").notNull(),
    isOfficial: boolean("is_official").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    configuration: jsonb("configuration").notNull().default({}),
    ...timestamps,
  },
  (table) => [uniqueIndex("providers_code_idx").on(table.code)],
);

export const providerConnections = pgTable(
  "provider_connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => providers.id),
    externalAccountId: text("external_account_id"),
    accountIdentifier: text("account_identifier"),
    status: text("status").notNull().default("inactive"),
    encryptedCredentials: text("encrypted_credentials"),
    encryptedTokenPayload: text("encrypted_token_payload"),
    tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
    lastConnectedAt: timestamp("last_connected_at", { withTimezone: true }),
    lastValidatedAt: timestamp("last_validated_at", { withTimezone: true }),
    lastSuccessfulSyncAt: timestamp("last_successful_sync_at", {
      withTimezone: true,
    }),
    lastErrorCode: text("last_error_code"),
    lastErrorMessage: text("last_error_message"),
    configuration: jsonb("configuration").notNull().default({}),
    ...timestamps,
  },
  (table) => [
    index("provider_connections_user_idx").on(table.userId),
    uniqueIndex("provider_connections_account_idx").on(
      table.userId,
      table.providerId,
      table.externalAccountId,
    ),
  ],
);

export const sourceApplications = pgTable("source_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerId: uuid("provider_id").references(() => providers.id),
  bundleIdentifier: text("bundle_identifier"),
  packageName: text("package_name"),
  name: text("name").notNull(),
  version: text("version"),
  platform: text("platform"),
  metadata: jsonb("metadata").notNull().default({}),
  ...timestamps,
});

export const devices = pgTable(
  "devices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    manufacturer: text("manufacturer").notNull(),
    brand: text("brand").notNull(),
    model: text("model").notNull(),
    marketingName: text("marketing_name"),
    deviceType: text("device_type").notNull(),
    serialNumberEncrypted: text("serial_number_encrypted"),
    hardwareVersion: text("hardware_version"),
    softwareVersion: text("software_version"),
    firmwareVersion: text("firmware_version"),
    macAddressEncrypted: text("mac_address_encrypted"),
    firstUsedAt: timestamp("first_used_at", { withTimezone: true }),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    purchasedAt: timestamp("purchased_at", { withTimezone: true }),
    retiredAt: timestamp("retired_at", { withTimezone: true }),
    isCurrent: boolean("is_current").notNull().default(false),
    metadata: jsonb("metadata").notNull().default({}),
    ...timestamps,
  },
  (table) => [index("devices_user_idx").on(table.userId)],
);

export const providerDevices = pgTable(
  "provider_devices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => providers.id),
    deviceId: uuid("device_id")
      .notNull()
      .references(() => devices.id, { onDelete: "cascade" }),
    externalDeviceId: text("external_device_id").notNull(),
    rawPayload: jsonb("raw_payload"),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("provider_devices_external_idx").on(
      table.providerId,
      table.externalDeviceId,
    ),
  ],
);

export const deviceUsagePeriods = pgTable(
  "device_usage_periods",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    deviceId: uuid("device_id")
      .notNull()
      .references(() => devices.id, { onDelete: "cascade" }),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    isApproximateStart: boolean("is_approximate_start")
      .notNull()
      .default(false),
    isApproximateEnd: boolean("is_approximate_end").notNull().default(false),
    purpose: text("purpose"),
    isPrimary: boolean("is_primary").notNull().default(false),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => [
    index("device_usage_periods_user_time_idx").on(
      table.userId,
      table.startsAt,
    ),
  ],
);

export const importBatches = pgTable(
  "import_batches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerId: uuid("provider_id").references(() => providers.id),
    status: text("status").notNull().default("pending"),
    importType: text("import_type").notNull(),
    parserName: text("parser_name"),
    parserVersion: text("parser_version"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    totalRecords: integer("total_records").notNull().default(0),
    processedRecords: integer("processed_records").notNull().default(0),
    failedRecords: integer("failed_records").notNull().default(0),
    metadata: jsonb("metadata").notNull().default({}),
    ...timestamps,
  },
  (table) => [
    index("import_batches_user_created_idx").on(table.userId, table.createdAt),
  ],
);

export const sourceFiles = pgTable(
  "source_files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    importBatchId: uuid("import_batch_id")
      .notNull()
      .references(() => importBatches.id, { onDelete: "cascade" }),
    originalName: text("original_name").notNull(),
    storagePath: text("storage_path").notNull(),
    mediaType: text("media_type").notNull(),
    byteSize: integer("byte_size").notNull(),
    sha256: text("sha256").notNull(),
    encrypted: boolean("encrypted").notNull().default(true),
    metadata: jsonb("metadata").notNull().default({}),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("source_files_user_sha_idx").on(table.userId, table.sha256),
  ],
);

export const measurementUnits = pgTable(
  "measurement_units",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    symbol: text("symbol").notNull(),
    dimension: text("dimension").notNull(),
    ucumCode: text("ucum_code"),
    ...timestamps,
  },
  (table) => [uniqueIndex("measurement_units_code_idx").on(table.code)],
);

export const metricDefinitions = pgTable(
  "metric_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    category: text("category").notNull(),
    valueType: text("value_type").notNull().default("numeric"),
    canonicalUnitId: uuid("canonical_unit_id").references(
      () => measurementUnits.id,
    ),
    isClinical: boolean("is_clinical").notNull().default(false),
    metadata: jsonb("metadata").notNull().default({}),
    ...timestamps,
  },
  (table) => [uniqueIndex("metric_definitions_code_idx").on(table.code)],
);

export const measurements = pgTable(
  "measurements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    metricDefinitionId: uuid("metric_definition_id")
      .notNull()
      .references(() => metricDefinitions.id),
    unitId: uuid("unit_id")
      .notNull()
      .references(() => measurementUnits.id),
    providerId: uuid("provider_id").references(() => providers.id),
    sourceApplicationId: uuid("source_application_id").references(
      () => sourceApplications.id,
    ),
    deviceId: uuid("device_id").references(() => devices.id),
    importBatchId: uuid("import_batch_id").references(() => importBatches.id),
    sourceFileId: uuid("source_file_id").references(() => sourceFiles.id),
    externalId: text("external_id"),
    measuredAt: timestamp("measured_at", { withTimezone: true }).notNull(),
    timezone: text("timezone"),
    utcOffsetMinutes: integer("utc_offset_minutes"),
    value: numeric("value", { precision: 30, scale: 10 }).notNull(),
    originalValue: text("original_value").notNull(),
    originalUnit: text("original_unit").notNull(),
    sourceType: text("source_type").notNull(),
    quality: text("quality").notNull().default("unknown"),
    confidence: numeric("confidence", { precision: 5, scale: 4 }),
    algorithmName: text("algorithm_name"),
    algorithmVersion: text("algorithm_version"),
    rawPayload: jsonb("raw_payload"),
    fingerprint: text("fingerprint"),
    ...timestamps,
  },
  (table) => [
    index("measurements_user_time_idx").on(table.userId, table.measuredAt),
    index("measurements_metric_time_idx").on(
      table.metricDefinitionId,
      table.measuredAt,
    ),
    uniqueIndex("measurements_provider_external_idx").on(
      table.providerId,
      table.externalId,
    ),
  ],
);

export const dailyMetricSummaries = pgTable(
  "daily_metric_summaries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    metricDefinitionId: uuid("metric_definition_id")
      .notNull()
      .references(() => metricDefinitions.id),
    summaryDate: date("summary_date").notNull(),
    timezone: text("timezone").notNull(),
    minValue: numeric("min_value", { precision: 30, scale: 10 }),
    maxValue: numeric("max_value", { precision: 30, scale: 10 }),
    averageValue: numeric("average_value", { precision: 30, scale: 10 }),
    sumValue: numeric("sum_value", { precision: 30, scale: 10 }),
    lastValue: numeric("last_value", { precision: 30, scale: 10 }),
    sampleCount: integer("sample_count").notNull().default(0),
    metadata: jsonb("metadata").notNull().default({}),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("daily_metric_summaries_unique_idx").on(
      table.userId,
      table.metricDefinitionId,
      table.summaryDate,
    ),
  ],
);

export const sourcePriorities = pgTable(
  "source_priorities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    metricDefinitionId: uuid("metric_definition_id").references(
      () => metricDefinitions.id,
    ),
    providerId: uuid("provider_id").references(() => providers.id),
    deviceId: uuid("device_id").references(() => devices.id),
    priority: integer("priority").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    reason: text("reason"),
    ...timestamps,
  },
  (table) => [
    index("source_priorities_lookup_idx").on(
      table.userId,
      table.metricDefinitionId,
      table.priority,
    ),
  ],
);
