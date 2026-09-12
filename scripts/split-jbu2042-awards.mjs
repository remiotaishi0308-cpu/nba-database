// Extract awards from jbu2042.json into src/data/jbu2042/awards.json so the CMS
// can edit them. leaders は [name,team,val] のタプル配列を {p,t,v} に変換。
// getSeason2042() が元の形に戻して返す。
//
//   node scripts/split-jbu2042-awards.mjs
//
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcFile = join(root, "src", "data", "jbu2042.json");
const outFile = join(root, "src", "data", "jbu2042", "awards.json");

const d = JSON.parse(readFileSync(srcFile, "utf8"));
const awards = d.awards || {};

function convLeaders(leaders) {
  if (!leaders) return leaders;
  const out = {};
  for (const lg of Object.keys(leaders)) {
    out[lg] = {};
    for (const grp of Object.keys(leaders[lg])) {
      out[lg][grp] = {};
      for (const stat of Object.keys(leaders[lg][grp])) {
        out[lg][grp][stat] = (leaders[lg][grp][stat] || []).map((row) =>
          Array.isArray(row) ? { p: row[0] ?? "", t: row[1] ?? "", v: row[2] ?? "" } : row
        );
      }
    }
  }
  return out;
}

if (awards.leaders) awards.leaders = convLeaders(awards.leaders);

writeFileSync(outFile, JSON.stringify(awards, null, 2) + "\n", "utf8");

const base = { ...d };
delete base.awards;
writeFileSync(srcFile, JSON.stringify(base, null, 2) + "\n", "utf8");

console.log("awards extracted; leaders->{p,t,v}. base keys:", Object.keys(base).join(", "));
