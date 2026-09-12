// Replace the 2030 entry's `leagues` block with the user-supplied table.
// Other 2030 fields (heroImageUrl / summaryImageUrl / subCopy / summaryImages
// / personalStats etc.) are preserved untouched.
import fs from "node:fs";
import path from "node:path";

const FILE = path.resolve("src/data/standings.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const LEAGUES_2030 = {
  "セ・リーグ": [
    { rank: 1, team: "難波ボルテッカーズ",           wins: 81, losses: 58, ties: 4, winPercentage: 0.583, gamesBehind: 0,    runsScored: null, runsAllowed: null, teamAvg: 0.212, teamEra: 2.57, strikeouts: 1266, hits: 1030, homeRuns: 135, ops: null, comment: "優勝" },
    { rank: 2, team: "杜王スピリットフェニックス",   wins: 80, losses: 62, ties: 1, winPercentage: 0.563, gamesBehind: 2.5,  runsScored: null, runsAllowed: null, teamAvg: 0.219, teamEra: 2.80, strikeouts: 1242, hits: 1063, homeRuns: 140, ops: null, comment: "2位" },
    { rank: 3, team: "清澄ホワイトリバーズ",         wins: 79, losses: 63, ties: 1, winPercentage: 0.556, gamesBehind: 3.5,  runsScored: null, runsAllowed: null, teamAvg: 0.217, teamEra: 2.63, strikeouts: 1209, hits: 1067, homeRuns: 114, ops: null, comment: "3位" },
    { rank: 4, team: "北海道レイブンクロウズ",       wins: 76, losses: 64, ties: 3, winPercentage: 0.543, gamesBehind: 5.5,  runsScored: null, runsAllowed: null, teamAvg: 0.226, teamEra: 2.68, strikeouts: 1319, hits: 1122, homeRuns: 120, ops: null, comment: "4位" },
    { rank: 5, team: "広島セントラルレイカーズ",     wins: 70, losses: 72, ties: 1, winPercentage: 0.493, gamesBehind: 12.5, runsScored: null, runsAllowed: null, teamAvg: 0.230, teamEra: 3.70, strikeouts: 1288, hits: 1146, homeRuns: 147, ops: null, comment: "5位" },
    { rank: 6, team: "京都ミリオンアッシュ",         wins: 67, losses: 71, ties: 5, winPercentage: 0.486, gamesBehind: 13.5, runsScored: null, runsAllowed: null, teamAvg: 0.215, teamEra: 3.03, strikeouts: 1285, hits: 1058, homeRuns: 95,  ops: null, comment: "6位" },
    { rank: 7, team: "愛知プロミネンス",             wins: 69, losses: 74, ties: 0, winPercentage: 0.483, gamesBehind: 14.0, runsScored: null, runsAllowed: null, teamAvg: 0.225, teamEra: 3.22, strikeouts: 1291, hits: 1079, homeRuns: 130, ops: null, comment: "7位" },
    { rank: 8, team: "渋谷アーバンスターズ",         wins: 62, losses: 80, ties: 1, winPercentage: 0.437, gamesBehind: 20.5, runsScored: null, runsAllowed: null, teamAvg: 0.233, teamEra: 3.43, strikeouts: 1127, hits: 1153, homeRuns: 161, ops: null, comment: "8位" },
  ],
  "パ・リーグ": [
    { rank: 1, team: "長崎マリンフォース",           wins: 81, losses: 61, ties: 1, winPercentage: 0.570, gamesBehind: 0,    runsScored: null, runsAllowed: null, teamAvg: 0.238, teamEra: 3.18, strikeouts: 1383, hits: 1170, homeRuns: 195, ops: null, comment: "優勝" },
    { rank: 2, team: "梅田スラッガーズ",             wins: 77, losses: 63, ties: 3, winPercentage: 0.550, gamesBehind: 3.0,  runsScored: null, runsAllowed: null, teamAvg: 0.234, teamEra: 3.12, strikeouts: 1241, hits: 1169, homeRuns: 154, ops: null, comment: "2位" },
    { rank: 3, team: "横浜ベイクルーザーズ",         wins: 67, losses: 74, ties: 2, winPercentage: 0.475, gamesBehind: 13.5, runsScored: null, runsAllowed: null, teamAvg: 0.233, teamEra: 4.09, strikeouts: 1227, hits: 1162, homeRuns: 167, ops: null, comment: "3位" },
    { rank: 4, team: "博多アクアリアス",             wins: 66, losses: 75, ties: 2, winPercentage: 0.468, gamesBehind: 14.5, runsScored: null, runsAllowed: null, teamAvg: 0.219, teamEra: 3.89, strikeouts: 1178, hits: 1078, homeRuns: 152, ops: null, comment: "4位" },
    { rank: 5, team: "川崎ウインドブレイカーズ",     wins: 65, losses: 77, ties: 1, winPercentage: 0.458, gamesBehind: 16.0, runsScored: null, runsAllowed: null, teamAvg: 0.217, teamEra: 3.73, strikeouts: 1251, hits: 1062, homeRuns: 157, ops: null, comment: "5位" },
    { rank: 6, team: "新潟イプシロンズ",             wins: 64, losses: 78, ties: 1, winPercentage: 0.451, gamesBehind: 17.0, runsScored: null, runsAllowed: null, teamAvg: 0.219, teamEra: 3.34, strikeouts: 1238, hits: 1080, homeRuns: 165, ops: null, comment: "6位" },
    { rank: 7, team: "福知山ネクサスナイン",         wins: 64, losses: 79, ties: 0, winPercentage: 0.448, gamesBehind: 17.5, runsScored: null, runsAllowed: null, teamAvg: 0.228, teamEra: 3.94, strikeouts: 1228, hits: 1119, homeRuns: 180, ops: null, comment: "7位" },
    { rank: 8, team: "流山シーマリナーズ",           wins: 63, losses: 80, ties: 0, winPercentage: 0.441, gamesBehind: 18.5, runsScored: null, runsAllowed: null, teamAvg: 0.240, teamEra: 4.61, strikeouts: 1143, hits: 1181, homeRuns: 170, ops: null, comment: "8位" },
  ],
};

const target = data.find((e) => e.year === 2030);
if (!target) throw new Error("2030 entry not found");

const beforeKeys = Object.keys(target);
target.leagues = LEAGUES_2030;

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

console.log("2030 leagues replaced (other fields preserved).");
console.log("  top-level keys (unchanged):", Object.keys(target).join(", "));
console.log("  セ count:", target.leagues["セ・リーグ"].length, " パ count:", target.leagues["パ・リーグ"].length);
// Show first row of each league for spot check
console.log("\n  セ rank=1:", JSON.stringify(target.leagues["セ・リーグ"][0]));
console.log("  パ rank=1:", JSON.stringify(target.leagues["パ・リーグ"][0]));
