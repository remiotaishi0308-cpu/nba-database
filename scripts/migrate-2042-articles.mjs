// Unify 2042 articles into the CMS. The 2042 season page (Season2042.jsx) used
// to keep its own article list inside jbu2042.json (DATA.articles), separate
// from src/content/articles. That meant articles added there never showed in
// the global /articles list (and vice versa). This script makes the CMS the
// single source of truth: it converts each jbu2042.json article into a CMS
// article file, then strips the now-unused `articles` array from jbu2042.json.
//
//   node scripts/migrate-2042-articles.mjs
//
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const jbuFile = join(root, "src", "data", "jbu2042.json");
const outDir = join(root, "src", "content", "articles");

const jbu = JSON.parse(readFileSync(jbuFile, "utf8"));
const articles = jbu.articles || [];

// "2042.3.8" / "2042.03.15" -> "2042-03-08" (zero-padded ISO date).
function toIso(date) {
  const m = String(date || "").match(/^(\d{4})\D(\d{1,2})\D(\d{1,2})$/);
  if (!m) return String(date || ""); // already ISO or unknown — leave as-is
  const [, y, mo, d] = m;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

// jbu2042 body is an array of lines using "## heading" / "> quote". The shared
// reader (ArticleDetail.jsx) and the season reader use "■ heading" + Markdown
// image syntax, so normalize to that one convention.
function toContent(body, photoUrls) {
  const blocks = (Array.isArray(body) ? body : [])
    .map((line) => String(line).trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith("## ")) return "■ " + line.slice(3).trim();
      if (line.startsWith("> ")) return line.slice(2).trim();
      return line;
    });
  // Carry the gallery photos into the body as inline images so both readers
  // render them without a separate photoUrls field.
  for (const url of photoUrls || []) {
    if (url) blocks.push(`![](${url})`);
  }
  return blocks.join("\n\n");
}

let written = 0;
for (const a of articles) {
  if (!a.id) continue;
  const out = {
    id: a.id,
    title: a.title ?? "",
    date: toIso(a.date),
    season: 2042,
    category: a.cat ?? "ニュース",
    tags: Array.isArray(a.tags) ? a.tags : [],
    thumbnailUrl: a.thumbnailUrl ?? "",
    summary: a.excerpt ?? "",
    content: toContent(a.body, a.photoUrls),
  };
  writeFileSync(
    join(outDir, `${a.id}.json`),
    JSON.stringify(out, null, 2) + "\n",
    "utf8"
  );
  written += 1;
}

// Drop the now-unused article store so there is one source of truth.
delete jbu.articles;
writeFileSync(jbuFile, JSON.stringify(jbu, null, 2) + "\n", "utf8");

console.log(`migrated ${written} 2042 article(s) -> CMS, removed jbu2042.json articles[]`);
