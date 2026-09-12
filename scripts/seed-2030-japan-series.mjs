// Add the 2030 Japan Series entry to japanSeries.json.
import fs from "node:fs";
import path from "node:path";

const FILE = path.resolve("src/data/japanSeries.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const NEW = {
  year: 2030,
  champion: "長崎マリンフォース",
  subChampion: "難波ボルテッカーズ",
  mvp: "赤月 (長崎) - 防御率 0.50 / 2勝 0敗",
  summary:
    "シリーズ序盤は長崎が接戦を制して連勝スタートを切りましたが、中盤で難波が強力打線を武器に盛り返し、一時はタイに戻しました。しかし、第5戦でのエース・赤月の快投が流れを再び長崎に引き寄せ、そのまま頂点へと駆け上がりました。長崎マリンフォースが4勝2敗で日本一に輝いています。",
  scores: [
    "第1戦: 難波 1-2 長崎",
    "第2戦: 難波 2-3 長崎",
    "第3戦: 長崎 7-9 難波",
    "第4戦: 長崎 1-4 難波",
    "第5戦: 長崎 4-0 難波",
    "第6戦: 難波 3-5 長崎",
  ],
  result: "総合勝敗: 長崎 4勝 - 2勝 難波",
};

const i = data.findIndex((e) => e.year === NEW.year);
if (i >= 0) data[i] = NEW;
else data.push(NEW);
data.sort((a, b) => a.year - b.year);

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

// Sanity-check: tally scores must match the declared result
const tally = { 長崎: 0, 難波: 0 };
const reGame = /^第\d+戦:\s*(\S+?)\s+(\d+)-(\d+)\s+(\S+?)\s*$/;
for (const line of NEW.scores) {
  const m = line.match(reGame);
  if (!m) { console.log("UNPARSED:", line); continue; }
  const [, a, sa, sb, b] = m;
  const winner = Number(sa) > Number(sb) ? a : Number(sb) > Number(sa) ? b : null;
  if (winner && tally[winner] !== undefined) tally[winner]++;
}
console.log("japanSeries.json years:", data.map((e) => e.year));
console.log("2030 score tally:", tally, "→ champion check:",
  tally["長崎"] === 4 && tally["難波"] === 2 ? "✓" : "✗");
