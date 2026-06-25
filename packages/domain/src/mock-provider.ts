import type {
  HealthDataProvider,
  MeasurementSyncRequest,
  MeasurementSyncResult,
  ProviderContext,
  ProviderDevice,
} from "./index";

export class MockProvider implements HealthDataProvider {
  readonly code = "mock";

  async discoverDevices(_context: ProviderContext): Promise<ProviderDevice[]> {
    return [
      {
        externalId: "mock-watch-1",
        manufacturer: "Genki",
        model: "Mock Watch",
        deviceType: "smartwatch",
      },
    ];
  }

  async syncMeasurements(
    request: MeasurementSyncRequest,
  ): Promise<MeasurementSyncResult> {
    const measuredAt = request.to ?? new Date();
    return {
      measurements: [
        {
          externalId: `mock-steps-${measuredAt.toISOString().slice(0, 10)}`,
          metricCode: "steps",
          value: "8421",
          originalValue: "8421",
          unitCode: "count",
          originalUnitCode: "count",
          measuredAt,
          sourceType: "measured",
          rawPayload: { synthetic: true },
        },
      ],
    };
  }
}
