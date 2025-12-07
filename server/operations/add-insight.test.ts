// server/operations/add-insight.test.ts
import { expect } from "jsr:@std/expect";
import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import addInsight from "./add-insight.ts";

describe("addInsight", () => {
  describe("when inserting a valid insight", () => {
    withDB((fixture) => {
      let created: Insight;

      beforeEach(() => {
        created = addInsight({
          ...fixture,
          brandId: 42,
          text: "  This is a fresh insight!  ",
        });
      });

      it("returns the new insight with correct fields", () => {
        expect(created).toMatchObject({
          id: expect.any(Number),
          brand: 42,
          text: "This is a fresh insight!",
        });
        expect(created.createdAt).toBeInstanceOf(Date);
        expect(created.createdAt.getTime()).toBeGreaterThan(Date.now() - 5000);
      });

      it("actually persists the insight in the database", () => {
        const rows = fixture.db.sql`SELECT * FROM insights WHERE id = ${created.id}`;
        expect(rows).toHaveLength(1);
        expect(rows[0]).toMatchObject({
          brand: 42,
          text: "This is a fresh insight!",
        });
      });
    });
  });

  describe("edge cases", () => {
    withDB((fixture) => {
      it("trims whitespace from text", () => {
        const insight = addInsight({
          ...fixture,
          brandId: 1,
          text: "   \t\n  hello world  \r\n  ",
        });
        expect(insight.text).toBe("hello world");
      });

      it("accepts brandId = 0", () => {
        const insight = addInsight({
          ...fixture,
          brandId: 0,
          text: "brand zero",
        });
        expect(insight.brand).toBe(0);
      });
    });
  });
});