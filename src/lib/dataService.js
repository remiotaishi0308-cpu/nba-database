// Centralized data access. Today reads from local JSON; later can be swapped
// out for fetch() calls against an API without touching the UI components.

import teamsJson from "../data/teams.json";
import standingsJson from "../data/standings.json";
import playersJson from "../data/players.json";
import draftsJson from "../data/drafts.json";
import tournamentsJson from "../data/tournaments.json";
import newsJson from "../data/news.json";
import seasonJson from "../data/season.json";
import csJson from "../data/climaxSeries.json";
import jsJson from "../data/japanSeries.json";
import titlesJson from "../data/titles.json";
import teamPlayerStatsJson from "../data/teamPlayerStats.json";
import transactionsJson from "../data/transactions.json";
import seasonRecapsJson from "../data/seasonRecaps.json";
import allTimeRecordsJson from "../data/allTimeRecords.json";
import schoolsJson from "../data/schools.json";
import prizeRankingJson from "../data/prizeRanking.json";
import tournamentRecapsJson from "../data/tournamentRecaps.json";
import awardsJson from "../data/awards.json";
import monthlyMvpJson from "../data/monthlyMvp.json";
// MLB時代(2042以降)は 1シーズン=1ファイル（src/data/seasons/<year>.json）。
// CMSのフォルダコレクションで新規作成/複製できる。glob で全シーズンを読み込む。
const seasonModules = import.meta.glob("../data/seasons/*.json", { eager: true });
const SEASONS = (() => {
  const m = {};
  for (const [path, mod] of Object.entries(seasonModules)) {
    const y = path.match(/(\d{4})\.json$/);
    if (y) m[y[1]] = mod.default ?? mod;
  }
  return m;
})();

// Articles are now one JSON file per article under src/content/articles/, so the
// CMS (Sveltia/Decap) can add/edit a single story without touching a shared
// file. import.meta.glob loads them all at build time; each module's default
// export is the article object. We sort newest-first once and reuse.
const articleModules = import.meta.glob("../content/articles/*.json", {
  eager: true,
});
const articlesJson = Object.values(articleModules)
  .map((m) => m.default ?? m)
  .filter((a) => a && a.id)
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

// ---- Regulation eras -------------------------------------------------------
// From 2042 JBU switched to the MLB-style format (AL/NL, 3 divisions, World
// Series). Years >= MLB_ERA_START render the new layout; earlier years keep the
// legacy NPB layout. See pages/jbu2042/Season2042.jsx and YearPortalLayout.
// NBA2K は全年度が同一システム（シーズンポータル）で描画される。
// 旧JBUの era 分岐は廃し、常にポータルを使う。
export const MLB_ERA_START = 2000;
export function isMlbEra() {
  return true;
}
// 全MLBシーズンの年（新しい順）。seasons/ フォルダのファイルから自動取得。
export const MLB_SEASON_YEARS = Object.keys(SEASONS)
  .map(Number)
  .sort((a, b) => b - a);

// 指定年のMLB時代データを Season 画面が使う形で返す。teams は配列→abbrキーへ。
export function getSeasonData(year) {
  const s = SEASONS[String(year)];
  if (!s) return null;
  const teams = {};
  for (const t of s.teams ?? []) if (t && t.abbr) teams[t.abbr] = t;
  // teamStats は配列(CMS用) → abbrキーの {teamStats,batters,pitchers} へ戻す。
  const teamStats = {};
  const tsList = Array.isArray(s.teamStats)
    ? s.teamStats
    : Object.entries(s.teamStats ?? {}).map(([abbr, v]) => ({ abbr, ...v }));
  for (const e of tsList) {
    if (e && e.abbr)
      teamStats[e.abbr] = {
        teamStats: e.teamStats ?? {},
        batters: e.batters ?? [],
        pitchers: e.pitchers ?? [],
      };
  }
  return { ...s, teams, teamStats };
}
// 後方互換（既存呼び出し用）
export function getSeason2042() {
  return getSeasonData(MLB_ERA_START) || getSeasonData(MLB_SEASON_YEARS[0]);
}
export function getSeason2042Teams() {
  const s = getSeason2042();
  return s ? s.teamStats : {};
}

// MLB-era seasons that exist as data (currently just the 2042 dataset). These
// are selectable in the year switcher even though they have no standings.json
// entry, because the new format keeps its data in jbu2042.json.
const mlbEraYears = MLB_SEASON_YEARS;

const availableStandingsYears = standingsJson.map((s) => s.year);

// 選択可能なシーズンは seasons/ フォルダのファイルのみ（新しい順）。
export const JBU_YEARS = [...mlbEraYears].sort((a, b) => b - a);

// 最新シーズン（デフォルト表示・各種フォールバックの基準）。
export const CURRENT_YEAR = JBU_YEARS.length ? JBU_YEARS[0] : 2026;

// Newest selectable season across BOTH eras (currently 2042). This is the
// default landing season so Home opens on the latest season available.
export const LATEST_YEAR = JBU_YEARS.length ? JBU_YEARS[0] : CURRENT_YEAR;

// ---- Teams -----------------------------------------------------------------

// Pre-built lookup so getTeamByName() can resolve full name, shortName, or id
// in a single map hit. Older datasets stored full names ("渋谷アーバンスターズ")
// while newer year-scoped data uses shortNames ("渋谷") — we accept both so the
// UI doesn't lose TeamBadges when crossing that boundary.
const TEAM_LOOKUP = (() => {
  const m = new Map();
  for (const t of teamsJson) {
    if (t.name) m.set(t.name, t);
    if (t.shortName) m.set(t.shortName, t);
    if (t.id) m.set(t.id, t);
  }
  return m;
})();

export function getTeams() {
  return teamsJson;
}
export function getTeamById(id) {
  return teamsJson.find((t) => t.id === id);
}
export function getTeamByName(name) {
  if (!name) return undefined;
  return TEAM_LOOKUP.get(name);
}

// ---- Year-scoped JBU pages -------------------------------------------------

// Standings JSON is an array of seasons. Each season has leagues keyed by
// Japanese league names. UI consumes a normalized { season, central, pacific }
// shape with teamId resolved from team name.
export function getStandings(year = CURRENT_YEAR) {
  const entry = standingsJson.find((s) => s.year === Number(year));
  if (!entry) return null;
  const cen = entry.leagues?.["セ・リーグ"] ?? [];
  const pac = entry.leagues?.["パ・リーグ"] ?? [];
  const adapt = (rows) =>
    rows.map((r) => {
      const team = getTeamByName(r.team);
      const wins = r.wins ?? 0;
      const losses = r.losses ?? 0;
      const ties = r.ties ?? 0;
      const decided = wins + losses;
      // Prefer the explicit JSON field (winPercentage), fall back to legacy
      // pct, then compute on the fly. NPB convention: wins / (wins+losses).
      const pct =
        r.winPercentage ?? r.pct ?? (decided ? wins / decided : 0);
      return {
        teamId: team?.id,
        teamName: r.team,
        rank: r.rank,
        wins,
        losses,
        ties,
        games: wins + losses + ties,
        pct,
        gamesBehind: r.gamesBehind ?? 0,
        streak: r.streak ?? "",
        comment: r.comment ?? "",
        // Detail metrics (added to schema 2025-). Default 0 so the UI can render
        // every column without a missing-field guard.
        runsScored: r.runsScored ?? 0,
        runsAllowed: r.runsAllowed ?? 0,
        teamAvg: r.teamAvg ?? 0,
        teamEra: r.teamEra ?? 0,
        strikeouts: r.strikeouts ?? 0,
        hits: r.hits ?? 0,
        homeRuns: r.homeRuns ?? 0,
        ops: r.ops ?? 0,
      };
    });
  return { season: year, central: adapt(cen), pacific: adapt(pac) };
}

export function getStandingsYears() {
  return [...availableStandingsYears].sort((a, b) => b - a);
}

// Year-level media (hero banner, recap eyecatch, editorial copy) lives on the
// standings entry alongside year+leagues so a single year object holds
// everything UI needs.
export function getYearMedia(year) {
  const entry = standingsJson.find((s) => s.year === Number(year));
  if (!entry) return null;
  const summaryImages = Array.isArray(entry.summaryImages)
    ? entry.summaryImages
    : entry.summaryImageUrl
    ? [entry.summaryImageUrl]
    : [];
  return {
    heroImageUrl: entry.heroImageUrl ?? null,
    summaryImageUrl: entry.summaryImageUrl ?? null,
    summaryImages,
    subCopy: entry.subCopy ?? "",
  };
}

export function getPersonalStats(year, teamId) {
  const entry = standingsJson.find((s) => s.year === Number(year));
  if (!entry?.personalStats) return null;

  const team = getTeamById(teamId);
  if (!team) return null;

  const league = team.league === "central" ? "セ・リーグ" : "パ・リーグ";
  const leagueStats = entry.personalStats[league];
  if (!leagueStats?.個人成績) return null;

  // Filter by team shortName
  return leagueStats.個人成績.filter((s) => s.team === team.shortName);
}

export function getClimaxSeries(year) {
  return csJson.find((c) => c.year === Number(year)) ?? null;
}

export function getJapanSeries(year) {
  return jsJson.find((j) => j.year === Number(year)) ?? null;
}

export function getTitles(year) {
  return titlesJson.find((t) => t.year === Number(year)) ?? null;
}

export function getAwards(year) {
  return awardsJson.find((a) => a.year === Number(year)) ?? null;
}

export function getMonthlyMvp(year) {
  return monthlyMvpJson.find((m) => m.year === Number(year)) ?? null;
}

// ---- Players & Stats -------------------------------------------------------

export function getPlayers() {
  return playersJson;
}

export function getTeamPlayerStats(year, teamId) {
  const yearData = teamPlayerStatsJson[String(year)] ?? {};
  return teamId ? yearData[teamId] ?? null : yearData;
}

// ---- Drafts ----------------------------------------------------------------
// drafts.json shape:
//   { "drafts": { "<year>": { "<teamName>": [{round,name,position,type}, ...] } } }
// We normalize into { year, teams: {<teamName>: picks[]}, highlights: [] } so the
// UI can rely on a single shape. Legacy array-shaped data is also accepted so
// upgrades stay safe.

function normalizeDraftYear(year, byTeam) {
  const teams = {};
  if (byTeam && typeof byTeam === "object") {
    for (const [teamName, picks] of Object.entries(byTeam)) {
      teams[teamName] = Array.isArray(picks)
        ? [...picks].sort((a, b) => (a?.round ?? 0) - (b?.round ?? 0))
        : [];
    }
  }
  return { year: Number(year), teams, highlights: [] };
}

function getNormalizedDrafts() {
  if (Array.isArray(draftsJson)) {
    return draftsJson.map((d) => normalizeDraftYear(d.year, d.teams ?? {}));
  }
  const byYear = draftsJson?.drafts ?? {};
  return Object.entries(byYear).map(([y, picksByTeam]) =>
    normalizeDraftYear(y, picksByTeam)
  );
}

export function getDrafts() {
  return getNormalizedDrafts().sort((a, b) => b.year - a.year);
}

export function getDraftByYear(year) {
  return (
    getNormalizedDrafts().find((d) => d.year === Number(year)) ?? null
  );
}

// ---- Transactions / Recaps / News / Season --------------------------------

export function getTransactions(year) {
  return transactionsJson[String(year)] ?? [];
}
export function getSeasonRecap(year) {
  // Try seasonRecapsJson first, then fall back to standings.json seasonSummary
  const fromRecaps = seasonRecapsJson[String(year)];
  if (fromRecaps) return fromRecaps;
  
  const standings = standingsJson.find((s) => s.year === Number(year));
  return standings?.seasonSummary ?? null;
}
export function getNews(limit) {
  const sorted = [...newsJson].sort((a, b) => b.date.localeCompare(a.date));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
export function getCurrentSeason() {
  return {
    ...seasonJson,
    current: CURRENT_YEAR,
  };
}

// ---- Tournaments / High school --------------------------------------------

export function getTournaments() {
  return [...tournamentsJson].sort((a, b) => b.year - a.year);
}

export function getAllTimeRecords() {
  return allTimeRecordsJson;
}

export function getSchools() {
  return schoolsJson;
}
export function getSchoolById(id) {
  return schoolsJson.find((s) => s.id === id);
}
export function getPrizeRanking(year) {
  return prizeRankingJson[String(year)] ?? [];
}
export function getPrizeRankingYears() {
  return Object.keys(prizeRankingJson)
    .map(Number)
    .sort((a, b) => b - a);
}
export function getTournamentRecaps() {
  return tournamentRecapsJson;
}

// ---- Articles (cross-year long-form content) ------------------------------

export function getArticles({ category } = {}) {
  const list = [...articlesJson].sort((a, b) =>
    (b.date || "").localeCompare(a.date || "")
  );
  if (!category) return list;
  return list.filter((a) => a.category === category);
}

export function getArticleById(id) {
  return articlesJson.find((a) => a.id === id) ?? null;
}

// NBAシーズンは年をまたぐ（例: 2026-27 シーズン = 2026/7〜2027/6）。
// 記事の日付から「開始年」を求める: 7月以降=その年 / 6月以前=前年。
export function nbaSeasonStart(dateStr) {
  const m = String(dateStr ?? "").match(/^(\d{4})-(\d{1,2})/);
  if (!m) return NaN;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  return mo >= 7 ? y : y - 1;
}

// 開始年 → "2026-27" 形式の表示ラベル。
export function seasonLabel(startYear) {
  const y = Number(startYear);
  if (!Number.isFinite(y)) return String(startYear ?? "");
  return `${y}-${String(y + 1).slice(-2)}`;
}

// Articles scoped to a single season. 明示 season フィールドがあれば最優先、
// 無ければ日付から NBA シーズン（開始年）を判定する。これにより年をまたいだ
// 記事（例: 2027-01 は 2026-27 シーズン）も正しいシーズンに入る。
// Newest first so each season's article tab leads with its latest story.
export function getArticlesByYear(year) {
  const y = Number(year);
  return [...articlesJson]
    .filter((a) =>
      (a.season != null ? Number(a.season) : nbaSeasonStart(a.date)) === y
    )
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function getArticleCategories() {
  return [...new Set(articlesJson.map((a) => a.category).filter(Boolean))];
}
