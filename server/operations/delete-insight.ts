import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  id: number;
};

const deleteInsight = (input: Input): { ok: boolean } => {
  const { db, id } = input;

  // Perform the delete
  const result = db.sql`
    DELETE FROM insights
    WHERE id = ${id}
  `;

  return { ok: true };
};

export default deleteInsight;
