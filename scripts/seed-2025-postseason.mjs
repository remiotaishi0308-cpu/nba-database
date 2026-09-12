// Seed 2025 Climax Series result data + season recap.
// - climaxSeries.json: replace the 2025 entry with a richer schema
//   (winner/loser/wins/advantage + per-game structured scores).
// - seasonRecaps.json: add a 2025 entry matching the 2039 shape.
// Other years are not touched.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/data");
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
const writeJson = (f, v) =>
  fs.writeFileSync(path.join(ROOT, f), JSON.stringify(v, null, 2) + "\n", "utf8");

// --- 2025 Climax Series ---------------------------------------------------
// Per-game scoring uses {game, winnerScore, loserScore} where winner/loser is
// the EVENTUAL STAGE WINNER. So a "loser team won this game" appears as
// winnerScore < loserScore for that row.

const CS_2025 = {
  year: 2025,
  "セ・リーグ": {
    "ファーストステージ": {
      winner: "清澄ホワイトリバーズ",
      loser:  "北海道レイブンクロウズ",
      winnerWins: 2,
      loserWins:  0,
      advantageTo:   null,   // first stage has no advantage win
      advantageWins: 0,
      games: [
        { game: 1, winnerScore: 3, loserScore: 0 },
        { game: 2, winnerScore: 4, loserScore: 3 },
      ],
    },
    "ファイナルステージ": {
      winner: "清澄ホワイトリバーズ",
      loser:  "難波ボルテッカーズ",
      winnerWins: 4,         // total wins on winner's side
      loserWins:  1,         // total wins on loser's side (incl. advantage)
      advantageTo:   "loser",// 難波 (regular-season champ) had the advantage
      advantageWins: 1,
      games: [
        { game: 1, winnerScore: 9, loserScore: 0 },
        { game: 2, winnerScore: 7, loserScore: 1 },
        { game: 3, winnerScore: 6, loserScore: 3 },
        { game: 4, winnerScore: 5, loserScore: 1 },
      ],
    },
  },
  "パ・リーグ": {
    "ファーストステージ": {
      winner: "博多アクアリアス",
      loser:  "流山シーマリナーズ",
      winnerWins: 2,
      loserWins:  1,
      advantageTo:   null,
      advantageWins: 0,
      games: [
        { game: 1, winnerScore: 4, loserScore: 0 },
        { game: 2, winnerScore: 1, loserScore: 3 },
        { game: 3, winnerScore: 5, loserScore: 3 },
      ],
    },
    "ファイナルステージ": {
      winner: "博多アクアリアス",
      loser:  "長崎マリンフォース",
      winnerWins: 4,
      loserWins:  2,
      advantageTo:   "loser", // 長崎 (regular-season champ) had the advantage
      advantageWins: 1,
      games: [
        { game: 1, winnerScore: 2,  loserScore: 1 },
        { game: 2, winnerScore: 0,  loserScore: 5 },
        { game: 3, winnerScore: 8,  loserScore: 2 },
        { game: 4, winnerScore: 4,  loserScore: 3 },
        { game: 5, winnerScore: 11, loserScore: 0 },
      ],
    },
  },
};

// --- 2025 Season recap (matches the 2039 shape) ---------------------------

const RECAP_2025 = {
  title: "2025 シーズン総括 — 下剋上の幕開け",
  author: "JBU編集部",
  publishedAt: "2025-11-15",
  headline:
    "投高打低の最初のシーズン。シーズン3位同士の清澄・博多がCSを制して日本シリーズへ進出。",
  sections: [
    {
      h: "シーズン概況",
      p: "これから始まるペナントの最初のシーズン。2025シーズンは投高打低が顕著に見受けられたシーズンで、投手に至っては防御率0点台、20勝を挙げる投手も出るほど。",
    },
    {
      h: "ペナントレース",
      p: "パリーグは長崎が9月6日に優勝を決めて圧倒的強さを見せるも、セリーグは混戦の末、難波が優勝。",
    },
    {
      h: "クライマックスシリーズ",
      p: "しかし、CSではどちらもシーズン3位の清澄、博多が日本シリーズに進出するという稀に見る下剋上同士の戦いとなった。",
    },
  ],
};

// --- apply ----------------------------------------------------------------

function upsertCsByYear(list, entry) {
  const i = list.findIndex((e) => e.year === entry.year);
  if (i >= 0) list[i] = entry;
  else list.push(entry);
  return list;
}

const cs = readJson("climaxSeries.json");
upsertCsByYear(cs, CS_2025);
cs.sort((a, b) => a.year - b.year);
writeJson("climaxSeries.json", cs);

const recaps = readJson("seasonRecaps.json");
recaps["2025"] = RECAP_2025;
writeJson("seasonRecaps.json", recaps);

// --- report ---------------------------------------------------------------

console.log("climaxSeries.json years:", cs.map((e) => e.year));
console.log("seasonRecaps.json keys:", Object.keys(recaps));
const c = CS_2025["セ・リーグ"]["ファイナルステージ"];
console.log(
  `\nセ ファイナル: ${c.winner} ${c.winnerWins}-${c.loserWins} ${c.loser}` +
    (c.advantageWins ? ` (advantageTo=${c.advantageTo})` : "")
);
const p = CS_2025["パ・リーグ"]["ファイナルステージ"];
console.log(
  `パ ファイナル: ${p.winner} ${p.winnerWins}-${p.loserWins} ${p.loser}` +
    (p.advantageWins ? ` (advantageTo=${p.advantageTo})` : "")
);

// sanity: actual game wins per side must match (winnerWins - advantage to winner)
for (const lg of ["セ・リーグ", "パ・リーグ"]) {
  for (const st of ["ファーストステージ", "ファイナルステージ"]) {
    const s = CS_2025[lg][st];
    const wActual = s.games.filter((g) => g.winnerScore > g.loserScore).length;
    const lActual = s.games.filter((g) => g.winnerScore < g.loserScore).length;
    const expectedW = s.winnerWins - (s.advantageTo === "winner" ? s.advantageWins : 0);
    const expectedL = s.loserWins  - (s.advantageTo === "loser"  ? s.advantageWins : 0);
    const ok = wActual === expectedW && lActual === expectedL;
    console.log(
      `  ${lg} ${st}: actual ${wActual}-${lActual} vs expected ${expectedW}-${expectedL} ${ok ? "✓" : "✗ MISMATCH"}`
    );
  }
}
