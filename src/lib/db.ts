import { neon } from "@neondatabase/serverless";

function createSql() {
  return neon(process.env.DATABASE_URL!);
}

type Sql = ReturnType<typeof createSql>;

let sql: Sql | undefined;
let schemaReady: Promise<void> | undefined;

async function ensureSchema(client: Sql) {
  await client`
    CREATE TABLE IF NOT EXISTS clothing_items (
      id TEXT PRIMARY KEY,
      "imagePath" TEXT NOT NULL,
      category TEXT NOT NULL,
      colors TEXT NOT NULL,
      season TEXT NOT NULL,
      style TEXT NOT NULL,
      description TEXT NOT NULL,
      "createdAt" DOUBLE PRECISION NOT NULL
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS person_photos (
      id TEXT PRIMARY KEY,
      "imagePath" TEXT NOT NULL,
      angle TEXT NOT NULL,
      "createdAt" DOUBLE PRECISION NOT NULL
    )
  `;
}

export async function getDb(): Promise<Sql> {
  if (!sql) sql = createSql();
  if (!schemaReady) schemaReady = ensureSchema(sql);
  await schemaReady;
  return sql!;
}

export interface ClothingItem {
  id: string;
  imagePath: string;
  category: string;
  colors: string;
  season: string;
  style: string;
  description: string;
  createdAt: number;
}

export interface PersonPhoto {
  id: string;
  imagePath: string;
  angle: string;
  createdAt: number;
}
