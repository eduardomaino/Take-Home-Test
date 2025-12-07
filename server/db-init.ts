import { Database } from "@db/sqlite";

export function initDb(dbFilePath: string) {
  const db = new Database(dbFilePath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS insights (
    id INTEGER PRIMARY KEY ASC NOT NULL,
    brand INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    text TEXT NOT NULL
    );
  `);

  return db;
}
