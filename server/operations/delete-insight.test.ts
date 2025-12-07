// server/operations/delete-insight.test.ts
import { expect } from "jsr:@std/expect";
import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import addInsight from "./add-insight.ts";
import deleteInsight from "./delete-insight.ts";

describe("deleteInsight", () => {
  describe("when the insight exists", () => {
    withDB((fixture) => {
      let insight: Insight;

      beforeEach(() => {
        insight = addInsight({
          ...fixture,
          brandId: 99,
          text: "This will be deleted",
        });
        const result = deleteInsight({ ...fixture, id: insight.id });
        expect(result).toEqual({ ok: true });
      });

      it("removes the insight from the database", () => {
        const rows = fixture.db.sql`SELECT * FROM insights WHERE id = ${insight.id}`;
        expect(rows).toHaveLength(0);
      });
    });
  });

  describe("when the insight does not exist", () => {
    withDB((fixture) => {
      it("still returns { ok: true } (idempotent)", () => {
        const result = deleteInsight({ ...fixture, id: 999999 });
        expect(result).toEqual({ ok: true });
      });

      it("does not affect other rows", () => {
        const kept = addInsight({
          ...fixture,
          brandId: 5,
          text: "this one stays",
        });

        deleteInsight({ ...fixture, id: 999999 }); // non-existent

        const rows = fixture.db.sql`SELECT * FROM insights WHERE id = ${kept.id}`;
        expect(rows).toHaveLength(1);
      });
    });
  });
});