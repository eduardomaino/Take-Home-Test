// deno-lint-ignore-file no-explicit-any
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { initDb } from "./db-init.ts";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import addInsight from "./operations/add-insight.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = initDb(dbFilePath);

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights", async (ctx) => {
  try {
    const body = await ctx.request.body.json();
    const { brandId, text } = body;

    const insight = addInsight({
      db,
      brandId: Number(brandId),
      text,
    });

    ctx.response.status = 201;
    ctx.response.body = insight;
  } catch (err) {
    console.error("Error in POST /insights:", err);
    ctx.response.status = 500;
    ctx.response.body = { error: err.message };
  }
});


router.get("/insights/delete", (ctx) => {
  // TODO
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
