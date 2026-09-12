// Move the single 2042 MLB-era dataset into a per-season folder structure so the
// site can hold multiple seasons (2042, 2043, ...) and switch between them,
// keeping all history.
//
//   src/data/jbu2042/{teams,standings,postseason,awards}.json
//   src/data/jbu2042.json           (season, regulationNote, prospects)
//   src/data/jbu2042Teams.json      (per-team roster/stats)
//        ↓
//   src/data/seasons/2042/{teams,standings,postseason,awards,meta,teamStats}.json
//
//   node scripts/migrate-to-seasons.mjs
//
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const rd = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const year = 2042;
const outDir = join(root, "src", "data", "seasons", String(year));
mkdirSync(outDir, { recursive: true });

const base = rd("src/data/jbu2042.json"); // { season, regulationNote, prospects }
const teams = rd("src/data/jbu2042/teams.json"); // { teams: [...] }
const standings = rd("src/data/jbu2042/standings.json");
const postseason = rd("src/data/jbu2042/postseason.json");
const awards = rd("src/data/jbu2042/awards.json");
const teamStats = existsSync(join(root, "src/data/jbu2042Teams.json"))
  ? rd("src/data/jbu2042Teams.json")
  : {};

const meta = {
  season: base.season ?? year,
  regulationNote: base.regulationNote ?? "",
  prospects: base.prospects ?? {},
};

const w = (name, obj) =>
  writeFileSync(join(outDir, name), JSON.stringify(obj, null, 2) + "\n", "utf8");

w("meta.json", meta);
w("teams.json", teams);
w("standings.json", standings);
w("postseason.json", postseason);
w("awards.json", awards);
w("teamStats.json", teamStats);

console.log(`migrated season ${year} -> src/data/seasons/${year}/ (meta, teams, standings, postseason, awards, teamStats)`);
