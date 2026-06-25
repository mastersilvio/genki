import { z } from "zod";

const environmentSchema = z.object({
  APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_TIMEZONE: z.string().default("America/Sao_Paulo"),
  APP_PORT: z.coerce.number().int().positive().default(3005),
  APP_SECRET_KEY: z
    .string()
    .min(32)
    .default("development-secret-key-change-me-now"),
  DATA_ENCRYPTION_KEY: z
    .string()
    .min(32)
    .default("development-data-key-change-me-now"),
  DATABASE_URL: z
    .string()
    .default("postgres://genki:genki@localhost:5438/genki"),
  REDIS_URL: z.string().default("redis://localhost:6380"),
  STORAGE_BACKEND: z.enum(["local", "s3"]).default("local"),
  LOCAL_STORAGE_PATH: z.string().default("./storage"),
  WEB_ORIGIN: z.string().default("http://localhost:5174"),
});

export type Environment = z.infer<typeof environmentSchema>;

export const loadEnvironment = (
  input: Record<string, string | undefined> = process.env,
): Environment => environmentSchema.parse(input);
