// (1) The CS entry previously seeded under year 2030 was actually 2032 data —
//     move it to year 2032 unchanged.
// (2) Replace year 2030 with the correctly-labeled CS data.
//
// Final stage パ has a draw, so the schema also gains an optional `ties` field
// on the stage level. The UI doesn't render it yet, but the data is captured
// for future use.
import fs from "node:fs";
import path from "node:path";

const FILE = path.resolve("src/data/climaxSeries.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

// ----- (1) move existing 2030 → 2032 -------------------------------------

const existing2030 = data.find((e) => e.year === 2030);
if (existing2030) {
  existing2030.year = 2032;
  console.log("→ moved previous 2030 entry to year=2032");
} else {
  console.log("(no existing 2030 entry to move)");
}

// ----- (2) build new 2030 CS data ----------------------------------------

const NEW_2030 = {
  year: 2030,
  "セ・リーグ": {
    "ファーストステージ": {
      winner: "清澄ホワイトリバーズ",
      loser:  "杜王スピリットフェニックス",
      winnerWins: 2,
      loserWins:  1,
      advantageTo:   null,
      advantageWins: 0,
      games: [
        // G1: 杜王 0-4 清澄 → 清澄 won 4-0
        { game: 1, winnerScore: 4, loserScore: 0 },
        // G2: 杜王 2-0 清澄 → 杜王 won 2-0
        { game: 2, winnerScore: 0, loserScore: 2 },
        // G3: 杜王 1-2 清澄 → 清澄 won 2-1
        { game: 3, winnerScore: 2, loserScore: 1 },
      ],
    },
    "ファイナルステージ": {
      winner: "難波ボルテッカーズ",
      loser:  "清澄ホワイトリバーズ",
      winnerWins: 4,   // 3 actual + 1 advantage
      loserWins:  0,
      advantageTo:   "winner",   // pennant winner 難波 carried the advantage
      advantageWins: 1,
      games: [
        // G1: 難波 5-2 清澄
        { game: 1, winnerScore: 5, loserScore: 2 },
        // G2: 難波 2-1 清澄
        { game: 2, winnerScore: 2, loserScore: 1 },
        // G3: 難波 1-0 清澄
        { game: 3, winnerScore: 1, loserScore: 0 },
      ],
    },
  },
  "パ・リーグ": {
    "ファーストステージ": {
      winner: "梅田スラッガーズ",
      loser:  "横浜ベイクルーザーズ",
      winnerWins: 2,
      loserWins:  0,
      advantageTo:   null,
      advantageWins: 0,
      games: [
        // G1: 梅田 10-0 横浜
        { game: 1, winnerScore: 10, loserScore: 0 },
        // G2: 梅田 13-1 横浜
        { game: 2, winnerScore: 13, loserScore: 1 },
      ],
    },
    "ファイナルステージ": {
      winner: "長崎マリンフォース",
      loser:  "梅田スラッガーズ",
      // User-stated totals: 長崎 3勝 + advantage 1 = 4 total; 梅田 1勝 + 1分
      // Per-game count gives 長崎 2 on-field wins, so the 3勝 statement
      // appears to count {2 wins + 1 tie-credit}. We store the user-stated
      // totals literally and surface the draw via `ties`.
      winnerWins: 4,   // user says 計4勝 (3 + advantage)
      loserWins:  1,
      ties:       1,   // G4 draw
      advantageTo:   "winner",
      advantageWins: 1,
      games: [
        // G1: 長崎 5-0 梅田
        { game: 1, winnerScore: 5,  loserScore: 0  },
        // G2: 長崎 5-1 梅田
        { game: 2, winnerScore: 5,  loserScore: 1  },
        // G3: 長崎 7-15 梅田 → 梅田 won
        { game: 3, winnerScore: 7,  loserScore: 15 },
        // G4: 長崎 3-3 梅田 → DRAW
        { game: 4, winnerScore: 3,  loserScore: 3,  draw: true },
      ],
    },
  },
};

// upsert + sort
const i = data.findIndex((e) => e.year === 2030);
if (i >= 0) data[i] = NEW_2030;
else data.push(NEW_2030);
data.sort((a, b) => a.year - b.year);

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

// ----- sanity check ------------------------------------------------------

console.log("\nclimaxSeries.json years:", data.map((e) => e.year));
function check(year, label, s) {
  const games = s.games ?? [];
  const wActual = games.filter((g) => !g.draw && g.winnerScore > g.loserScore).length;
  const lActual = games.filter((g) => !g.draw && g.winnerScore < g.loserScore).length;
  const tActual = games.filter((g) => g.draw || g.winnerScore === g.loserScore).length;
  const expW = s.winnerWins - (s.advantageTo === "winner" ? s.advantageWins : 0);
  const expL = s.loserWins  - (s.advantageTo === "loser"  ? s.advantageWins : 0);
  const okW = wActual === expW;
  const okL = lActual === expL;
  const okT = tActual === (s.ties ?? 0);
  console.log(
    `  ${year} ${label}: on-field W-L-T = ${wActual}-${lActual}-${tActual}` +
      `   vs expect ${expW}-${expL}-${s.ties ?? 0}` +
      `   ${okW && okL && okT ? "✓" : "✗ (note: ties may shift counts)"}`
  );
}
const r = NEW_2030;
check(2030, "セ First ", r["セ・リーグ"]["ファーストステージ"]);
check(2030, "セ Final ", r["セ・リーグ"]["ファイナルステージ"]);
check(2030, "パ First ", r["パ・リーグ"]["ファーストステージ"]);
check(2030, "パ Final ", r["パ・リーグ"]["ファイナルステージ"]);
