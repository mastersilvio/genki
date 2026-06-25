import { loadEnvironment } from "@genki/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const environment = loadEnvironment();
export const sql = postgres(environment.DATABASE_URL, { max: 10 });
export const db = drizzle(sql, { schema });

export const checkDatabase = async (): Promise<boolean> => {
  try {
    await sql`select 1`;
    return true;
  } catch {
    return false;
  }
};

export { schema };
