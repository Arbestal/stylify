import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, "stilify.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS clothing_items (
    id TEXT PRIMARY KEY,
    imagePath TEXT NOT NULL,
    category TEXT NOT NULL,
    colors TEXT NOT NULL,
    season TEXT NOT NULL,
    style TEXT NOT NULL,
    description TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS person_photos (
    id TEXT PRIMARY KEY,
    imagePath TEXT NOT NULL,
    angle TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  );
`);

export default db;

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
