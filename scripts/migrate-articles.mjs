// One-time migration: split the monolithic src/data/articles.json into one JSON
// file per article under src/content/articles/. After this, Sveltia/Decap CMS
// manages each article as its own file (a folder collection), and dataService
// loads them with import.meta.glob. Safe to re-run: it overwrites by id.
//
//   node scripts/migrate-articles.mjs
//
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcFile = join(root, "src", "data", "articles.json");
const outDir = join(root, "src", "content", "articles");

const articles = JSON.parse(readFileSync(srcFile, "utf8"));
mkdirSync(outDir, { recursive: true });

// Canonical field order so generated files read cleanly and match the CMS schema.
function shape(a) {
  return {
    id: a.id,
    title: a.title ?? "",
    date: a.date ?? "",
    // season may be absent on older items; keep it only when present so
    // dataService can fall back to the year embedded in the date.
    ...(a.season != null ? { season: Number(a.season) } : {}),
    category: a.category ?? "ニュース",
    tags: Array.isArray(a.tags) ? a.tags : [],
    thumbnailUrl: a.thumbnailUrl ?? "",
    summary: a.summary ?? "",
    content: a.content ?? "",
  };
}

let written = 0;
const seen = new Set();
for (const a of articles) {
  if (!a.id) {
    console.warn("skip: article without id ->", a.title);
    continue;
  }
  if (seen.has(a.id)) {
    console.warn("skip: duplicate id ->", a.id);
    continue;
  }
  seen.add(a.id);
  const file = join(outDir, `${a.id}.json`);
  writeFileSync(file, JSON.stringify(shape(a), null, 2) + "\n", "utf8");
  written += 1;
}

console.log(`migrated ${written} article(s) -> src/content/articles/`);
if (existsSync(srcFile)) {
  console.log(
    "NOTE: src/data/articles.json is now unused by the app and can be kept as a backup."
  );
}
