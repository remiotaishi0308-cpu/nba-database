// 1シーズン=1ファイルに統合し、CMSフォルダコレクション(新規作成/複製可)に
// できるようにする。seasons/2042/*.json → seasons/2042.json。
// さらに 2043 を複製作成（season=2043 のたたき台）。
//
//   node scripts/combine-seasons.mjs
//
import { readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dir = join(root, "src", "data", "seasons");
const rd = (p) => JSON.parse(readFileSync(join(dir, p), "utf8"));

const meta = rd("2042/meta.json");
const teams = rd("2042/teams.json");
const standings = rd("2042/standings.json");
const postseason = rd("2042/postseason.json");
const awards = rd("2042/awards.json");
const teamStats = rd("2042/teamStats.json");

const season2042 = {
  season: meta.season ?? 2042,
  regulationNote: meta.regulationNote ?? "",
  prospects: meta.prospects ?? {},
  teams: teams.teams ?? [],
  standings,
  postseason,
  awards,
  teamStats,
};

writeFileSync(join(dir, "2042.json"), JSON.stringify(season2042, null, 2) + "\n", "utf8");

const season2043 = { ...season2042, season: 2043 };
writeFileSync(join(dir, "2043.json"), JSON.stringify(season2043, null, 2) + "\n", "utf8");

if (existsSync(join(dir, "2042"))) rmSync(join(dir, "2042"), { recursive: true, force: true });

console.log("combined -> 2042.json, duplicated -> 2043.json, removed 2042/ folder");
