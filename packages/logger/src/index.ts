const sensitiveKeys = new Set([
  "password",
  "token",
  "authorization",
  "cookie",
  "encryptedCredentials",
  "encryptedTokenPayload",
  "clinicalResult",
]);

const sanitize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        sensitiveKeys.has(key) ? "[REDACTED]" : sanitize(entry),
      ]),
    );
  }
  return value;
};

export type LogContext = Record<string, unknown>;

const write = (
  level: "debug" | "info" | "warn" | "error",
  message: string,
  context: LogContext = {},
) => {
  const safeContext = sanitize(context) as LogContext;
  const event = {
    timestamp: new Date().toISOString(),
    level,
    service: "genki-api",
    message,
    ...safeContext,
  };
  const serialized = JSON.stringify(event);
  if (level === "error") console.error(serialized);
  else console.log(serialized);
};

export const logger = {
  debug: (message: string, context?: LogContext) =>
    write("debug", message, context),
  info: (message: string, context?: LogContext) =>
    write("info", message, context),
  warn: (message: string, context?: LogContext) =>
    write("warn", message, context),
  error: (message: string, context?: LogContext) =>
    write("error", message, context),
};

export { sanitize };
