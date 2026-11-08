// Checks the translation files in src/messages:
// - every dashboard t("English text") has an Arabic entry in ar.json "dashboard"
// - ar.json "site" has exactly the keys of en.json "site", with the same {placeholders}
// - dashboard entries no longer used anywhere in the code (just a warning)
// Run: npm run i18n:check
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const en = read("src/messages/en.json");
const ar = read("src/messages/ar.json");

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === "(site)" ? [] : files(p);
    return /\.tsx?$/.test(name) ? [p] : [];
  });
}

const unquote = (s) => JSON.parse(`"${s}"`);
const holes = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

const problems = [];
const literals = new Set();
const used = new Map(); // key -> first file using it

for (const f of files("src")) {
  const code = readFileSync(f, "utf8");
  for (const m of code.matchAll(/"((?:[^"\\\n]|\\.)*)"/g)) literals.add(unquote(m[1]));
  for (const m of code.matchAll(/\bt\(\s*"((?:[^"\\\n]|\\.)*)"/g)) {
    const key = unquote(m[1]);
    if (!used.has(key)) used.set(key, f);
  }
}

// Dashboard
for (const [key, f] of used) {
  const arabic = ar.dashboard[key];
  if (arabic === undefined) problems.push(`dashboard: no Arabic for "${key}" (${f})`);
  else if (holes(arabic) !== holes(key)) problems.push(`dashboard: placeholders differ for "${key}"`);
}
const unused = Object.keys(ar.dashboard).filter((k) => !literals.has(k));

// Website
function compare(a, b, path) {
  if (typeof a === "string") {
    if (typeof b !== "string") return problems.push(`site: ${path} missing in ar.json`);
    if (holes(a) !== holes(b)) problems.push(`site: placeholders differ for ${path}`);
    return;
  }
  for (const k of Object.keys(a)) compare(a[k], b?.[k], `${path}.${k}`);
  for (const k of Object.keys(b ?? {})) if (!(k in a)) problems.push(`site: ${path}.${k} is in ar.json but not en.json`);
}
compare(en.site, ar.site, "site");

for (const k of unused) console.warn(`warning: dashboard entry not used in the code: "${k}"`);
for (const p of problems) console.error(p);
console.log(
  problems.length
    ? `\n${problems.length} problem(s) found.`
    : `Translations OK: ${used.size} dashboard texts, ${Object.keys(en.site).length} website labels.`,
);
process.exit(problems.length ? 1 : 0);
