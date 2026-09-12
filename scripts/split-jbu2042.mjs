// Split jbu2042.json into CMS-editable section files so Sveltia CMS can edit
// each without dropping the others (Decap/Sveltia only writes schema-defined
// fields, so each file must hold exactly one concern).
//
//   teams     -> src/data/jbu2042/teams.json      (ARRAY of teams, + logo field)
//   standings -> src/data/jbu2042/standings.json  (kept as nested object)
//   postseason-> src/data/jbu2042/postseason.json (kept as nested object)
//
// The remaining keys (season, regulationNote, prospects, awards) stay in
// jbu2042.json. dataService.getSeason2042() merges them back into the original
// shape, so Season2042.jsx keeps working unchanged.
//
//   node scripts/split-jbu2042.mjs
//
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcFile = join(root, "src", "data", "jbu2042.json");
const outDir = join(root, "src", "data", "jbu2042");

const d = JSON.parse(readFileSync(srcFile, "utf8"));
mkdirSync(outDir, { recursive: true });

// teams: object keyed by abbr -> array (CMS list-friendly). Add empty logo.
const teamsArray = Object.values(d.teams).map((t) => ({
  abbr: t.abbr,
  name: t.name,
  league: t.league,
  div: t.div,
  color: t.color,
  logo: t.logo ?? "",
}));

// Wrap in an object: a CMS file collection can't edit a top-level array.
writeFileSync(join(outDir, "teams.json"), JSON.stringify({ teams: teamsArray }, null, 2) + "\n", "utf8");
writeFileSync(join(outDir, "standings.json"), JSON.stringify(d.standings, null, 2) + "\n", "utf8");
writeFileSync(join(outDir, "postseason.json"), JSON.stringify(d.postseason, null, 2) + "\n", "utf8");

// Remove the extracted sections from the base file.
const base = { ...d };
delete base.teams;
delete base.standings;
delete base.postseason;
writeFileSync(srcFile, JSON.stringify(base, null, 2) + "\n", "utf8");

console.log(
  `split done: teams(${teamsArray.length}) -> jbu2042/teams.json, standings & postseason extracted; base keys now: ${Object.keys(base).join(", ")}`
);
