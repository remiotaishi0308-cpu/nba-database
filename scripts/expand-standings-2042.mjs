// Expand 2042 standings rows to the MLB-style column set (E#, RS, RA, L10,
// DIV, HOME, AWAY, DAY, NIGHT) while keeping existing W/L/GB/STRK/clinch.
// New fields default empty so they can be filled via the CMS. Clinch codes are
// uppercased to W/X/Y/Z (W=WildCard, X=Postseason, Y=Division, Z=Div & best).
//
//   node scripts/expand-standings-2042.mjs
//
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "..", "src", "data", "jbu2042", "standings.json");
const d = JSON.parse(readFileSync(file, "utf8"));

const expandRow = (r) => ({
  team: r.team,
  w: r.w ?? 0,
  l: r.l ?? 0,
  gb: r.gb ?? "—",
  e: r.e ?? "-",
  rs: r.rs ?? 0,
  ra: r.ra ?? 0,
  strk: r.strk ?? "",
  l10: r.l10 ?? "",
  div: r.div ?? "",
  home: r.home ?? "",
  away: r.away ?? "",
  day: r.day ?? "",
  night: r.night ?? "",
  clinch: (r.clinch ?? "").toUpperCase(),
});

for (const lg of Object.keys(d)) {
  for (const div of Object.keys(d[lg])) {
    d[lg][div] = d[lg][div].map(expandRow);
  }
}

writeFileSync(file, JSON.stringify(d, null, 2) + "\n", "utf8");
console.log("standings expanded; clinch uppercased.");
