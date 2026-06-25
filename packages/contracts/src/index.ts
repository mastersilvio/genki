import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const deviceInputSchema = z.object({
  manufacturer: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  marketingName: z.string().optional(),
  deviceType: z.string().min(1),
  firstUsedAt: z.iso.datetime().optional(),
  lastUsedAt: z.iso.datetime().optional(),
  isCurrent: z.boolean().default(false),
});

export const measurementInputSchema = z.object({
  metricCode: z.string().min(1),
  value: z.string().regex(/^-?\d+(\.\d+)?$/),
  unitCode: z.string().min(1),
  measuredAt: z.iso.datetime(),
  sourceType: z.enum([
    "measured",
    "estimated",
    "calculated",
    "manual",
    "file",
    "clinical",
  ]),
});

export interface ApiMeta {
  requestId: string;
  generatedAt: string;
}

export interface ApiSuccess<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta: Pick<ApiMeta, "requestId">;
}

export const success = <T>(data: T, requestId: string): ApiSuccess<T> => ({
  data,
  meta: { requestId, generatedAt: new Date().toISOString() },
});
