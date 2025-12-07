import type { HasDBClient } from "../shared.ts";
import type { Insight } from "$models/insight.ts";

type Input = HasDBClient & {
  brandId: number;
  text: string;
};

const createInsight = (input: Input): Insight => {
  const { db, brandId, text } = input;

  const now = new Date().toISOString();

  // This is the style used everywhere else in the repo (list-insights.ts, etc.)
  db.sql`
    INSERT INTO insights (brand, text, createdAt)
    VALUES (${brandId}, ${text.trim()}, ${now})
  `;

  // Get the auto-generated ID
  const { lastInsertRowId } = db;

  return {
    id: Number(lastInsertRowId),
    brand: brandId,        // ← note: column is "brand", not "brandId"
    text: text.trim(),
    createdAt: new Date(now),
  };
};

export default createInsight;