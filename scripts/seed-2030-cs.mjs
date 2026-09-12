// Add 2030 Climax Series entry to climaxSeries.json (new-schema rich format).
// Per-game scores use winnerScore/loserScore relative to the stage WINNER.
import fs from "node:fs";
import path from "node:path";

const FILE = path.resolve("src/data/climaxSeries.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const CS_2030 = {
  year: 2030,
  "セ・リーグ": {
    "ファーストステージ": {
      winner: "愛知プロミネンス",
      loser:  "渋谷アーバンスターズ",
      winnerWins: 2,
      loserWins:  0,
      advantageTo:   null,
      advantageWins: 0,
      games: [
        { game: 1, winnerScore: 4, loserScore: 1 },
        { game: 2, winnerScore: 5, loserScore: 2 },
      ],
    },
    "ファイナルステージ": {
      winner: "愛知プロミネンス",
      loser:  "広島セントラルレイカーズ",
      winnerWins: 4,
      loserWins:  3,           // 2 actual game wins + 1 advantage
      advantageTo:   "loser",  // regular-season league champ had the advantage
      advantageWins: 1,
      games: [
        { game: 1, winnerScore: 5, loserScore: 1 }, // 愛知 won (5-1)
        { game: 2, winnerScore: 2, loserScore: 4 }, // 広島 won (4-2)
        { game: 3, winnerScore: 1, loserScore: 2 }, // 広島 won (2-1)
        { game: 4, winnerScore: 3, loserScore: 2 }, // 愛知 won (3-2)
        { game: 5, winnerScore: 3, loserScore: 1 }, // 愛知 won (3-1)
        { game: 6, winnerScore: 9, loserScore: 3 }, // 愛知 won (9-3)
      ],
    },
  },
  "パ・リーグ": {
    "ファーストステージ": {
      winner: "長崎マリンフォース",
      loser:  "新潟イプシロンズ",
      winnerWins: 2,
      loserWins:  0,
      advantageTo:   null,
      advantageWins: 0,
      games: [
        { game: 1, winnerScore: 2, loserScore: 1 },
        { game: 2, winnerScore: 7, loserScore: 4 },
      ],
    },
    "ファイナルステージ": {
      winner: "長崎マリンフォース",
      loser:  "横浜ベイクルーザーズ",
      winnerWins: 4,
      loserWins:  2,           // 1 actual win + 1 advantage
      advantageTo:   "loser",
      advantageWins: 1,
      games: [
        { game: 1, winnerScore: 3,  loserScore: 9  }, // 横浜 won (9-3)
        { game: 2, winnerScore: 4,  loserScore: 3  }, // 長崎 won (4-3)
        { game: 3, winnerScore: 12, loserScore: 0  }, // 長崎 won (12-0)
        { game: 4, winnerScore: 12, loserScore: 0  }, // 長崎 won (12-0)
        { game: 5, winnerScore: 7,  loserScore: 1  }, // 長崎 won (7-1)
      ],
    },
  },
};

// upsert + sort
const i = data.findIndex((e) => e.year === 2030);
if (i >= 0) data[i] = CS_2030;
else data.push(CS_2030);
data.sort((a, b) => a.year - b.year);

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

// Sanity-check actual vs declared wins
console.log("climaxSeries.json years:", data.map((e) => e.year));
for (const lg of ["セ・リーグ", "パ・リーグ"]) {
  for (const st of ["ファーストステージ", "ファイナルステージ"]) {
    const s = CS_2030[lg][st];
    const wActual = s.games.filter((g) => g.winnerScore > g.loserScore).length;
    const lActual = s.games.filter((g) => g.winnerScore < g.loserScore).length;
    const expW = s.winnerWins - (s.advantageTo === "winner" ? s.advantageWins : 0);
    const expL = s.loserWins  - (s.advantageTo === "loser"  ? s.advantageWins : 0);
    const ok = wActual === expW && lActual === expL;
    console.log(`  ${lg} ${st}: actual ${wActual}-${lActual} vs expect ${expW}-${expL}  ${ok ? "✓" : "✗ MISMATCH"}`);
  }
}
