// Seed 2033 main personal titles into titles.json.
import fs from "node:fs";
import path from "node:path";

const FILE = path.resolve("src/data/titles.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const tie = (title, value, recipients) =>
  recipients.map((r) => {
    const row = { title, player: r.player, team: r.team };
    if (value) row.value = value;
    return row;
  });
const single = (title, player, team, value) =>
  tie(title, value, [{ player, team }]);

const SE = [
  ...single("MVP",            "元木",   "広島"),
  ...single("新人王",          "兵庫",   "清澄"),
  // 野手
  ...single("首位打者",        "塙",     "北海道", ".290"),
  ...tie("本塁打王", "27本", [
    { player: "元木", team: "広島" },
    { player: "識",   team: "広島" },
  ]),
  ...single("打点王",          "元木",   "広島",   "83打点"),
  ...single("最多安打",        "識",     "広島",   "143本"),
  ...single("最高出塁率",      "早乙女", "京都",   ".354"),
  ...single("盗塁王",          "塙",     "北海道", "22個"),
  // 投手
  ...tie("最多勝", "15勝", [
    { player: "須藤",   team: "難波" },
    { player: "太田",   team: "京都" },
    { player: "榊原",   team: "京都" },
  ]),
  ...single("最優秀防御率",    "大森",   "清澄",   "0.84"),
  ...single("最多奪三振",      "赤星",   "難波",   "312個"),
  ...single("勝率第1位",       "榊原",   "京都",   ".882"),
  ...single("最多セーブ",      "幕張",   "難波",   "37セーブ"),
  ...single("最優秀中継ぎ",    "比嘉",   "清澄",   "45HP"),
];

const PA = [
  ...single("MVP",            "小林",   "長崎"),
  ...single("沢村賞",          "里中",   "長崎"),
  ...single("新人王",          "藤牧",   "川崎"),
  // 野手
  ...single("首位打者",        "仲村",   "流山",   ".306"),
  ...tie("本塁打王", "28本", [
    { player: "平出", team: "福知山" },
    { player: "橘",   team: "新潟" },
  ]),
  ...single("打点王",          "平出",   "福知山", "85打点"),
  ...single("最多安打",        "草野",   "横浜",   "155本"),
  ...single("最高出塁率",      "仲村",   "流山",   ".366"),
  ...single("盗塁王",          "御手洗", "新潟",   "32個"),
  // 投手
  ...single("最多勝",          "里中",   "長崎",   "21勝"),
  ...single("最優秀防御率",    "達本",   "福知山", "1.18"),
  ...single("最多奪三振",      "達本",   "福知山", "328個"),
  ...single("勝率第1位",       "里中",   "長崎",   ".840"),
  ...tie("最多セーブ", "22セーブ", [
    { player: "音無", team: "新潟" },
    { player: "近藤", team: "梅田" },
  ]),
  ...single("最優秀中継ぎ",    "黒川",   "新潟",   "33HP"),
];

const NEW = {
  year: 2033,
  leagues: { "セ・リーグ": SE, "パ・リーグ": PA },
};

const i = data.findIndex((e) => e.year === 2033);
if (i >= 0) data[i] = NEW;
else data.push(NEW);
data.sort((a, b) => a.year - b.year);

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

// --- validation -----------------------------------------------------------

const teams = JSON.parse(fs.readFileSync(path.resolve("src/data/teams.json"), "utf8"));
const known = new Set(teams.flatMap((t) => [t.name, t.shortName, t.id].filter(Boolean)));

function checkTies(label, rows) {
  const groups = {};
  for (const r of rows) (groups[r.title] ??= []).push(r.player);
  const ties = Object.entries(groups).filter(([, v]) => v.length > 1);
  console.log(`  ${label}: rows=${rows.length}`);
  for (const [t, v] of ties) console.log(`     tied ${t}: ${v.join(" / ")}`);
  const bad = rows.filter((r) => !known.has(r.team));
  if (bad.length) console.log("     UNRESOLVED:", bad.map((r) => `${r.team}/${r.player}`).join(", "));
}

console.log("titles.json years:", data.map((e) => e.year).join(", "));
console.log("\n2033 titles:");
checkTies("セ・リーグ", SE);
checkTies("パ・リーグ", PA);
