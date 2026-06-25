import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { loadEnvironment } from "@genki/config";
import {
  deviceInputSchema,
  loginInputSchema,
  measurementInputSchema,
  success,
} from "@genki/contracts";
import { checkDatabase, db, schema } from "@genki/database";
import { MockProvider } from "@genki/domain/providers";
import { logger } from "@genki/logger";
import { desc, sql as drizzleSql, eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authenticate, readSession } from "./auth";
import { checkRedis } from "./redis";

const environment = loadEnvironment();
const mockProvider = new MockProvider();

const errorResponse = (
  requestId: string,
  code: string,
  message: string,
  details: Record<string, unknown> = {},
) => ({
  error: { code, message, details },
  meta: { requestId },
});

export const createApp = () =>
  new Elysia()
    .use(
      cors({
        origin: environment.WEB_ORIGIN,
        credentials: true,
      }),
    )
    .use(
      openapi({
        path: "/api/v1/openapi",
        documentation: {
          info: {
            title: "Genki API",
            version: "0.1.0",
            description: "API pessoal e longitudinal de dados de saúde.",
          },
          tags: [
            { name: "System", description: "Saúde e metadados do serviço" },
            { name: "Auth", description: "Autenticação local" },
            { name: "Canonical", description: "Modelo canônico da Fase 1" },
          ],
        },
      }),
    )
    .derive(({ headers }) => ({
      requestId: headers["x-request-id"] ?? crypto.randomUUID(),
    }))
    .onAfterHandle(({ request, requestId, set }) => {
      set.headers["x-request-id"] = requestId;
      logger.info("request_completed", {
        request_id: requestId,
        method: request.method,
        path: new URL(request.url).pathname,
        result: set.status ?? 200,
      });
    })
    .onError(({ error, requestId, set }) => {
      const resolvedRequestId = requestId ?? crypto.randomUUID();
      logger.error("request_failed", {
        request_id: resolvedRequestId,
        error_code: "UNHANDLED_ERROR",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      set.status = 500;
      return errorResponse(
        resolvedRequestId,
        "INTERNAL_SERVER_ERROR",
        "Não foi possível concluir a solicitação.",
      );
    })
    .group("/api/v1", (app) =>
      app
        .get(
          "/health",
          ({ requestId }) =>
            success(
              {
                status: "ok",
                service: "genki-api",
                environment: environment.APP_ENV,
              },
              requestId,
            ),
          { detail: { tags: ["System"] } },
        )
        .get(
          "/readiness",
          async ({ requestId, set }) => {
            const [database, cache] = await Promise.all([
              checkDatabase(),
              checkRedis(),
            ]);
            const ready = database && cache;
            if (!ready) set.status = 503;
            return success(
              { status: ready ? "ready" : "not_ready", database, cache },
              requestId,
            );
          },
          { detail: { tags: ["System"] } },
        )
        .get(
          "/version",
          ({ requestId }) =>
            success({ version: "0.1.0", phases: [0, 1] }, requestId),
          { detail: { tags: ["System"] } },
        )
        .post(
          "/auth/login",
          async ({ body, requestId, set }) => {
            const parsed = loginInputSchema.safeParse(body);
            if (!parsed.success) {
              set.status = 422;
              return errorResponse(
                requestId,
                "VALIDATION_ERROR",
                "Credenciais inválidas.",
                { issues: parsed.error.issues },
              );
            }
            const token = await authenticate(
              parsed.data.email,
              parsed.data.password,
            );
            if (!token) {
              set.status = 401;
              return errorResponse(
                requestId,
                "INVALID_CREDENTIALS",
                "E-mail ou senha incorretos.",
              );
            }
            return success({ token, tokenType: "Bearer" }, requestId);
          },
          { detail: { tags: ["Auth"] } },
        )
        .get(
          "/auth/session",
          async ({ headers, requestId, set }) => {
            const session = await readSession(headers.authorization);
            if (!session) {
              set.status = 401;
              return errorResponse(
                requestId,
                "UNAUTHENTICATED",
                "Sessão ausente ou expirada.",
              );
            }
            return success(session, requestId);
          },
          { detail: { tags: ["Auth"] } },
        )
        .post(
          "/auth/logout",
          ({ requestId }) => success({ loggedOut: true }, requestId),
          { detail: { tags: ["Auth"] } },
        )
        .get(
          "/providers",
          async ({ headers, requestId, set }) => {
            const session = await readSession(headers.authorization);
            if (!session) {
              set.status = 401;
              return errorResponse(requestId, "UNAUTHENTICATED", "Faça login.");
            }
            return success(await db.select().from(schema.providers), requestId);
          },
          { detail: { tags: ["Canonical"] } },
        )
        .post(
          "/providers/mock/sync",
          async ({ headers, requestId, set }) => {
            const session = await readSession(headers.authorization);
            if (!session) {
              set.status = 401;
              return errorResponse(requestId, "UNAUTHENTICATED", "Faça login.");
            }
            const result = await mockProvider.syncMeasurements?.({
              context: { userId: session.userId },
            });
            return success(result, requestId);
          },
          { detail: { tags: ["Canonical"] } },
        )
        .get(
          "/devices",
          async ({ headers, requestId, set }) => {
            const session = await readSession(headers.authorization);
            if (!session) {
              set.status = 401;
              return errorResponse(requestId, "UNAUTHENTICATED", "Faça login.");
            }
            const rows = await db
              .select()
              .from(schema.devices)
              .where(eq(schema.devices.userId, session.userId))
              .orderBy(desc(schema.devices.createdAt));
            return success(rows, requestId);
          },
          { detail: { tags: ["Canonical"] } },
        )
        .post(
          "/devices",
          async ({ body, headers, requestId, set }) => {
            const session = await readSession(headers.authorization);
            if (!session) {
              set.status = 401;
              return errorResponse(requestId, "UNAUTHENTICATED", "Faça login.");
            }
            const parsed = deviceInputSchema.safeParse(body);
            if (!parsed.success) {
              set.status = 422;
              return errorResponse(
                requestId,
                "VALIDATION_ERROR",
                "Dispositivo inválido.",
                { issues: parsed.error.issues },
              );
            }
            const [row] = await db
              .insert(schema.devices)
              .values({
                userId: session.userId,
                manufacturer: parsed.data.manufacturer,
                brand: parsed.data.brand,
                model: parsed.data.model,
                marketingName: parsed.data.marketingName,
                deviceType: parsed.data.deviceType,
                firstUsedAt: parsed.data.firstUsedAt
                  ? new Date(parsed.data.firstUsedAt)
                  : undefined,
                lastUsedAt: parsed.data.lastUsedAt
                  ? new Date(parsed.data.lastUsedAt)
                  : undefined,
                isCurrent: parsed.data.isCurrent,
              })
              .returning();
            set.status = 201;
            return success(row, requestId);
          },
          { detail: { tags: ["Canonical"] } },
        )
        .get(
          "/imports",
          async ({ headers, requestId, set }) => {
            const session = await readSession(headers.authorization);
            if (!session) {
              set.status = 401;
              return errorResponse(requestId, "UNAUTHENTICATED", "Faça login.");
            }
            const rows = await db
              .select()
              .from(schema.importBatches)
              .where(eq(schema.importBatches.userId, session.userId))
              .orderBy(desc(schema.importBatches.createdAt));
            return success(rows, requestId);
          },
          { detail: { tags: ["Canonical"] } },
        )
        .get(
          "/measurements",
          async ({ headers, requestId, set }) => {
            const session = await readSession(headers.authorization);
            if (!session) {
              set.status = 401;
              return errorResponse(requestId, "UNAUTHENTICATED", "Faça login.");
            }
            const rows = await db
              .select()
              .from(schema.measurements)
              .where(eq(schema.measurements.userId, session.userId))
              .orderBy(desc(schema.measurements.measuredAt))
              .limit(100);
            return success(rows, requestId);
          },
          { detail: { tags: ["Canonical"] } },
        )
        .post(
          "/measurements",
          async ({ body, headers, requestId, set }) => {
            const session = await readSession(headers.authorization);
            if (!session) {
              set.status = 401;
              return errorResponse(requestId, "UNAUTHENTICATED", "Faça login.");
            }
            const parsed = measurementInputSchema.safeParse(body);
            if (!parsed.success) {
              set.status = 422;
              return errorResponse(
                requestId,
                "VALIDATION_ERROR",
                "Medição inválida.",
                { issues: parsed.error.issues },
              );
            }
            const [metric] = await db
              .select()
              .from(schema.metricDefinitions)
              .where(eq(schema.metricDefinitions.code, parsed.data.metricCode))
              .limit(1);
            const [unit] = await db
              .select()
              .from(schema.measurementUnits)
              .where(eq(schema.measurementUnits.code, parsed.data.unitCode))
              .limit(1);
            if (!metric || !unit) {
              set.status = 422;
              return errorResponse(
                requestId,
                "UNKNOWN_METRIC_OR_UNIT",
                "Métrica ou unidade não cadastrada.",
              );
            }
            const [row] = await db
              .insert(schema.measurements)
              .values({
                userId: session.userId,
                metricDefinitionId: metric.id,
                unitId: unit.id,
                measuredAt: new Date(parsed.data.measuredAt),
                value: parsed.data.value,
                originalValue: parsed.data.value,
                originalUnit: parsed.data.unitCode,
                sourceType: parsed.data.sourceType,
              })
              .returning();
            set.status = 201;
            return success(row, requestId);
          },
          { detail: { tags: ["Canonical"] } },
        )
        .get(
          "/metrics",
          async ({ requestId }) =>
            success(
              await db.select().from(schema.metricDefinitions),
              requestId,
            ),
          { detail: { tags: ["Canonical"] } },
        )
        .get(
          "/units",
          async ({ requestId }) =>
            success(await db.select().from(schema.measurementUnits), requestId),
          { detail: { tags: ["Canonical"] } },
        )
        .get(
          "/dashboard/today",
          async ({ headers, requestId, set }) => {
            const session = await readSession(headers.authorization);
            if (!session) {
              set.status = 401;
              return errorResponse(requestId, "UNAUTHENTICATED", "Faça login.");
            }
            const [counts] = await db
              .select({
                measurements: drizzleSql<number>`count(*)::int`,
                devices: drizzleSql<number>`(select count(*)::int from devices where user_id = ${session.userId})`,
              })
              .from(schema.measurements)
              .where(eq(schema.measurements.userId, session.userId));
            return success(
              {
                date: new Date().toISOString().slice(0, 10),
                measurements: counts?.measurements ?? 0,
                devices: counts?.devices ?? 0,
                status: "Dados sintéticos disponíveis após executar o seed.",
              },
              requestId,
            );
          },
          { detail: { tags: ["Canonical"] } },
        ),
    );
