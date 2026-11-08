// One-time upgrade of an existing database to bilingual JSON columns:
//   tours.title  "Old Damascus"  ->  {"en": "Old Damascus", "ar": "دمشق القديمة"}
// The Arabic text comes from the old `ar` / `title_ar` / `kicker_ar` columns,
// which are then removed. Website text moves from two rows (1 = en, 2 = ar)
// into one row: {"en": {...}, "ar": {...}}.
//
// Safe to run any number of times: already-converted data is left alone.
// `npm run db:push` runs it first, so the old columns are never dropped
// before their Arabic text has been copied.
import { createClient, type InValue } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL ?? "file:local.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

type Row = Record<string, unknown>;

const parse = (v: unknown): unknown => {
  if (typeof v !== "string") return v;
  try {
    return JSON.parse(v);
  } catch {
    return undefined;
  }
};
const isObj = (v: unknown): v is Row => !!v && typeof v === "object" && !Array.isArray(v);
const isTr = (v: unknown) => isObj(v) && ("en" in v || "ar" in v);
const str = (v: unknown) => (typeof v === "string" ? v : "");

async function columns(table: string) {
  const res = await client.execute(`pragma table_info(${table})`);
  return new Set(res.rows.map((r) => String(r.name)));
}

async function tableExists(table: string) {
  const res = await client.execute({ sql: "select 1 from sqlite_master where type = 'table' and name = ?", args: [table] });
  return res.rows.length > 0;
}

// Converts the text columns of one table and drops its old Arabic columns.
async function migrateTable(
  table: string,
  textFields: string[],
  oldArabic: { json?: string; extra?: Record<string, string> },
  objectFields: string[] = [],
) {
  if (!(await tableExists(table))) return 0;
  const cols = await columns(table);
  const arJsonCol = oldArabic.json && cols.has(oldArabic.json) ? oldArabic.json : null;
  const extraCols = Object.entries(oldArabic.extra ?? {}).filter(([col]) => cols.has(col));

  const rows = (await client.execute(`select * from ${table}`)).rows as unknown as Row[];
  let changed = 0;
  for (const row of rows) {
    const ar = isObj(parse(row[arJsonCol ?? ""])) ? (parse(row[arJsonCol ?? ""]) as Row) : {};
    for (const [col, field] of extraCols) if (!str(ar[field]).trim() && str(row[col]).trim()) ar[field] = row[col];

    const sets: string[] = [];
    const args: InValue[] = [];
    for (const f of textFields) {
      if (!cols.has(f)) continue;
      const current = parse(row[f]);
      if (isTr(current)) continue;
      sets.push(`${f} = ?`);
      args.push(JSON.stringify({ en: str(row[f]), ar: str(ar[f]) }));
    }
    for (const f of objectFields) {
      if (!cols.has(f)) continue;
      const current = parse(row[f]);
      if (isTr(current)) continue;
      sets.push(`${f} = ?`);
      args.push(JSON.stringify({ en: isObj(current) ? current : {}, ar: isObj(ar[f]) ? ar[f] : {} }));
    }
    if (!sets.length) continue;
    await client.execute({ sql: `update ${table} set ${sets.join(", ")} where id = ?`, args: [...args, row.id as InValue] });
    changed++;
  }

  for (const col of [arJsonCol, ...extraCols.map(([c]) => c)]) {
    if (col) await client.execute(`alter table ${table} drop column ${col}`);
  }
  return changed;
}

async function migrateSite() {
  if (!(await tableExists("site"))) return false;
  const rows = (await client.execute("select id, data from site order by id")).rows as unknown as Row[];
  const one = rows.find((r) => Number(r.id) === 1);
  const two = rows.find((r) => Number(r.id) === 2);
  const data1 = parse(one?.data);
  if (isTr(data1) && !two) return false;

  const en = isTr(data1) ? (data1 as Row).en : (data1 ?? {});
  const ar = isTr(data1) ? (data1 as Row).ar : (parse(two?.data) ?? {});
  const data = JSON.stringify({ en, ar });
  if (one) await client.execute({ sql: "update site set data = ? where id = 1", args: [data] });
  else await client.execute({ sql: "insert into site (id, data) values (1, ?)", args: [data] });
  await client.execute("delete from site where id <> 1");
  return true;
}

// The dashboard used to include a demo shop. Its tables held only sample
// data, so they are removed.
async function dropShopTables() {
  let dropped = 0;
  for (const table of ["orders", "products", "settings"]) {
    if (!(await tableExists(table))) continue;
    await client.execute(`drop table ${table}`);
    dropped++;
  }
  if (dropped) console.log(`Removed the demo shop tables (${dropped}).`);
}

async function main() {
  await client.execute("pragma foreign_keys = off");
  await dropShopTables();
  const site = await migrateSite();
  const tours = await migrateTable("tours", ["title", "summary"], { json: "ar", extra: { title_ar: "title" } }, ["details"]);
  const posts = await migrateTable("posts", ["title", "category", "excerpt", "author", "tags", "body"], { json: "ar", extra: { kicker_ar: "kicker" } });
  const pages = await migrateTable("pages", ["title", "subtitle", "body"], { json: "ar" });
  await client.execute("pragma foreign_keys = on");
  if (site || tours || posts || pages) {
    console.log(`Bilingual upgrade: website text ${site ? "merged into one row" : "already done"}, ${tours} tours, ${posts} articles, ${pages} pages converted to {"en","ar"}.`);
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
