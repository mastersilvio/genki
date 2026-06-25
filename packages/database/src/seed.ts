import { eq } from "drizzle-orm";
import { db, sql } from "./index";
import {
  devices,
  measurementUnits,
  metricDefinitions,
  providers,
  users,
} from "./schema";

const passwordHash = await Bun.password.hash("genki-local-2026");

const [user] = await db
  .insert(users)
  .values({
    email: "silvio@example.com",
    passwordHash,
    name: "Usuário Genki",
  })
  .onConflictDoUpdate({
    target: users.email,
    set: { name: "Usuário Genki", updatedAt: new Date() },
  })
  .returning();

await db
  .insert(providers)
  .values([
    {
      code: "mock",
      name: "Mock Provider",
      providerType: "synthetic",
      integrationType: "internal",
    },
    {
      code: "manual",
      name: "Entrada manual",
      providerType: "manual",
      integrationType: "manual",
    },
    {
      code: "file_import",
      name: "Importação de arquivo",
      providerType: "file",
      integrationType: "upload",
    },
  ])
  .onConflictDoNothing();

await db
  .insert(measurementUnits)
  .values([
    { code: "count", name: "Contagem", symbol: "", dimension: "count" },
    {
      code: "bpm",
      name: "Batimentos por minuto",
      symbol: "bpm",
      dimension: "frequency",
    },
    {
      code: "kg",
      name: "Quilograma",
      symbol: "kg",
      dimension: "mass",
      ucumCode: "kg",
    },
    {
      code: "percent",
      name: "Percentual",
      symbol: "%",
      dimension: "ratio",
      ucumCode: "%",
    },
  ])
  .onConflictDoNothing();

const unitRows = await db.select().from(measurementUnits);
const unitByCode = new Map(unitRows.map((unit) => [unit.code, unit.id]));

await db
  .insert(metricDefinitions)
  .values([
    {
      code: "steps",
      name: "Passos",
      category: "activity",
      canonicalUnitId: unitByCode.get("count"),
    },
    {
      code: "heart_rate",
      name: "Frequência cardíaca",
      category: "vital",
      canonicalUnitId: unitByCode.get("bpm"),
    },
    {
      code: "weight",
      name: "Peso",
      category: "body_composition",
      canonicalUnitId: unitByCode.get("kg"),
    },
    {
      code: "body_fat",
      name: "Gordura corporal",
      category: "body_composition",
      canonicalUnitId: unitByCode.get("percent"),
    },
  ])
  .onConflictDoNothing();

if (user) {
  const existing = await db
    .select({ id: devices.id })
    .from(devices)
    .where(eq(devices.userId, user.id))
    .limit(1);
  if (existing.length === 0) {
    await db.insert(devices).values({
      userId: user.id,
      manufacturer: "Genki",
      brand: "Genki",
      model: "Mock Watch",
      marketingName: "Relógio sintético",
      deviceType: "smartwatch",
      isCurrent: true,
      metadata: { synthetic: true },
    });
  }
}

await sql.end();
console.log("Seed sintético aplicado.");
