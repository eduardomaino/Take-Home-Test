import { Database } from "@db/sqlite";

export function initDb(dbFilePath: string) {
  const db = new Database(dbFilePath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    );
  `);

  return db;
}
