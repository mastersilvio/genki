import { loadEnvironment } from "@genki/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const environment = loadEnvironment();
const client = postgres(environment.DATABASE_URL, { max: 1 });
const database = drizzle(client);

await migrate(database, { migrationsFolder: "./migrations" });
await client.end();
console.log("Migrations aplicadas.");
