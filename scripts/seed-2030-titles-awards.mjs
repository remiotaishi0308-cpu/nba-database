// Seed 2030 personal titles into multiple JSON files:
//   - titles.json           : main league titles (incl. tied recipients)
//   - awards.json           : Golden Glove only (Best Nine not supplied)
//   - monthlyMvp.json       : monthly MVP per league × pitcher/hitter
//   - standings.json[2030]  : new `gameRecords` field for single-game / streak records
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/data");
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
const write = (f, v) =>
  fs.writeFileSync(path.join(ROOT, f), JSON.stringify(v, null, 2) + "\n", "utf8");

// ---------- helpers ------------------------------------------------------

function tie(title, value, recipients) {
  return recipients.map((r) => {
    const row = { title, player: r.player, team: r.team };
    if (value) row.value = value;
    return row;
  });
}
function single(title, player, team, value) {
  return tie(title, value, [{ player, team }]);
}

// ---------- titles.json 2030 --------------------------------------------

const SE_TITLES = [
  ...single("MVP",          "梶谷",   "難波"),
  ...single("新人王",        "佃",     "愛知"),
  ...tie("最多勝", "15勝", [
    { player: "有吉", team: "北海道" },
    { player: "滝川", team: "難波"   },
    { player: "大森", team: "清澄"   },
  ]),
  ...single("最優秀防御率",  "大森",   "清澄", "1.37"),
  ...single("最多奪三振",    "眉村",   "京都", "257個"),
  ...tie("勝率第1位", ".714", [
    { player: "滝川", team: "難波" },
    { player: "大森", team: "清澄" },
  ]),
  ...single("最多セーブ",    "藤嶋",   "杜王", "35セーブ"),
  ...single("最優秀中継ぎ",  "呉",     "広島", "39HP"),
  ...single("首位打者",      "古賀",   "愛知", ".282"),
  ...single("本塁打王",      "崎本",   "渋谷", "28本"),
  ...single("打点王",        "元木",   "広島", "81打点"),
  ...tie("盗塁王", "23盗塁", [
    { player: "末光", team: "愛知"   },
    { player: "塙",   team: "北海道" },
    { player: "平塚", team: "北海道" },
  ]),
  ...single("最多安打",      "二葉",   "広島", "147本"),
  ...single("最高出塁率",    "古賀",   "愛知", ".371"),
];

const PA_TITLES = [
  ...single("MVP",          "赤月",       "長崎"),
  ...single("沢村賞",        "赤月",       "長崎"),
  ...single("新人王",        "神宮司",     "長崎"),
  ...single("最多勝",        "赤月",       "長崎", "25勝"),
  ...single("最優秀防御率",  "忍野",       "川崎", "0.78"),
  ...single("最多奪三振",    "赤月",       "長崎", "335個"),
  ...single("勝率第1位",     "忍野",       "川崎", ".864"),
  ...single("最多セーブ",    "朝野",       "博多", "26セーブ"),
  ...single("最優秀中継ぎ",  "尾道",       "博多", "40HP"),
  ...single("首位打者",      "仲村",       "流山", ".282"),
  ...single("本塁打王",      "仲村",       "流山", "35本"),
  ...single("打点王",        "重松",       "流山", "88打点"),
  ...single("盗塁王",        "小林",       "長崎", "21個"),
  ...single("最多安打",      "仲村",       "流山", "170本"),
  ...tie("最高出塁率", ".350", [
    { player: "深川", team: "福知山" },
    { player: "権田", team: "横浜"   },
  ]),
];

const NEW_TITLES = {
  year: 2030,
  leagues: { "セ・リーグ": SE_TITLES, "パ・リーグ": PA_TITLES },
};

// ---------- awards.json 2030 (GG only) ----------------------------------

const NEW_AWARDS = {
  year: 2030,
  leagues: {
    "セ・リーグ": {
      "ゴールデングラブ": [
        { position: "投手",   player: "大森",   team: "清澄" },
        { position: "捕手",   player: "二葉",   team: "広島" },
        { position: "一塁手", player: "田中",   team: "渋谷" },
        { position: "二塁手", player: "竹中",   team: "杜王" },
        { position: "三塁手", player: "峯村",   team: "清澄" },
        { position: "遊撃手", player: "日暮",   team: "渋谷" },
        { position: "外野手", player: "古門",   team: "清澄" },
        { position: "外野手", player: "嶋根",   team: "杜王" },
        { position: "外野手", player: "菊田",   team: "渋谷" },
      ],
    },
    "パ・リーグ": {
      "ゴールデングラブ": [
        { position: "投手",   player: "赤月",   team: "長崎"   },
        { position: "捕手",   player: "笠松",   team: "長崎"   },
        { position: "一塁手", player: "中山",   team: "新潟"   },
        { position: "二塁手", player: "栗山",   team: "川崎"   },
        { position: "三塁手", player: "大前",   team: "流山"   },
        { position: "遊撃手", player: "小林",   team: "長崎"   },
        { position: "外野手", player: "権田",   team: "横浜"   },
        { position: "外野手", player: "岸永",   team: "梅田"   },
        { position: "外野手", player: "山根",   team: "川崎"   },
      ],
    },
  },
};

// ---------- monthlyMvp.json 2030 ----------------------------------------

const NEW_MONTHLY = {
  year: 2030,
  leagues: {
    "セ・リーグ": {
      "投手": [
        { month: "4月", player: "蝦名",   team: "杜王",   note: "防御率 0.57 / 4勝 0敗" },
        { month: "5月", player: "有吉",   team: "北海道", note: "防御率 0.00 / 3勝 0敗" },
        { month: "6月", player: "高橋",   team: "北海道", note: "防御率 1.51 / 4勝 0敗" },
        { month: "7月", player: "大森",   team: "清澄",   note: "防御率 0.21 / 4勝 1敗" },
        { month: "8月", player: "山下",   team: "難波",   note: "防御率 1.19 / 4勝 0敗" },
        { month: "9月", player: "星野",   team: "難波",   note: "防御率 0.39 / 3勝 0敗" },
      ],
      "打者": [
        { month: "4月", player: "志野",   team: "広島",   note: "打率 .322 / 6本 / 22点 / 7盗" },
        { month: "5月", player: "崎本",   team: "渋谷",   note: "打率 .333 / 7本 / 19点 / 6盗" },
        { month: "6月", player: "梶谷",   team: "難波",   note: "打率 .279 / 9本 / 20点" },
        { month: "7月", player: "嵯峨",   team: "北海道", note: "打率 .319 / 6本 / 17点 / 4盗" },
        { month: "8月", player: "田部",   team: "杜王",   note: "打率 .284 / 7本 / 16点 / 4盗" },
        { month: "9月", player: "古門",   team: "清澄",   note: "打率 .338 / 4本 / 11点 / 2盗" },
      ],
    },
    "パ・リーグ": {
      "投手": [
        { month: "4月", player: "忍野",   team: "川崎",   note: "防御率 0.86 / 4勝 0敗" },
        { month: "5月", player: "赤月",   team: "長崎",   note: "防御率 0.66 / 5勝 0敗" },
        { month: "6月", player: "達本",   team: "福知山", note: "防御率 0.00 / 4勝 0敗" },
        { month: "7月", player: "弓立",   team: "博多",   note: "防御率 0.95 / 4勝 0敗" },
        { month: "8月", player: "達本",   team: "福知山", note: "防御率 1.34 / 4勝 0敗" },
        { month: "9月", player: "忍野",   team: "川崎",   note: "防御率 0.85 / 5勝 0敗" },
      ],
      "打者": [
        { month: "4月", player: "重松",   team: "流山",   note: "打率 .353 / 9本 / 33点 / 4盗" },
        { month: "5月", player: "那波",   team: "博多",   note: "打率 .326 / 10本 / 24点 / 1盗" },
        { month: "6月", player: "神宮司", team: "長崎",   note: "打率 .264 / 10本 / 19点" },
        { month: "7月", player: "山根",   team: "川崎",   note: "打率 .313 / 7本 / 20点" },
        { month: "8月", player: "草野",   team: "横浜",   note: "打率 .297 / 11本 / 26点 / 1盗" },
        { month: "9月", player: "本郷",   team: "梅田",   note: "打率 .342 / 4本 / 14点 / 4盗" },
      ],
    },
  },
};

// ---------- standings.json[2030].gameRecords ----------------------------

const GAME_RECORDS = {
  "セ・リーグ": {
    "投手": [
      { title: "完全試合",         player: "浜田",     team: "清澄",   date: "6月5日",  opponent: "川崎" },
      { title: "1試合最多奪三振",  value: "19個",      player: "眉村", team: "京都",   date: "5月28日", opponent: "川崎" },
      { title: "1試合最多四球",    value: "9個",       player: "南",   team: "広島",   date: "8月8日",  opponent: "愛知" },
      { title: "1試合最多四球",    value: "9個",       player: "時任", team: "渋谷",   date: "8月4日",  opponent: "清澄" },
      { title: "1試合最多失点",    value: "8点",       player: "山崎伊", team: "渋谷", date: "7月9日",  opponent: "難波" },
    ],
    "野手": [
      { title: "猛打賞",           value: "14回",      player: "兵藤",   team: "渋谷"   },
      { title: "連続打席無安打",   value: "50打席",    player: "有吉",   team: "北海道" },
      { title: "サヨナラ本塁打",   player: "松戸",     team: "杜王",   date: "9月21日", opponent: "清澄" },
      { title: "サヨナラ本塁打",   player: "塚越",     team: "杜王",   date: "9月7日",  opponent: "渋谷" },
      { title: "サヨナラ本塁打",   player: "豊川",     team: "愛知",   date: "8月6日",  opponent: "広島" },
      { title: "連続試合安打",     value: "21試合",    player: "小山",   team: "広島"   },
      { title: "連続試合本塁打",   value: "4試合",     player: "古賀",   team: "愛知"   },
      { title: "連続試合出塁",     value: "38試合",    player: "越智",   team: "広島"   },
      { title: "連続打数安打",     value: "7打数",     player: "平岡",   team: "難波"   },
    ],
  },
  "パ・リーグ": {
    "投手": [
      { title: "連勝",             value: "13連勝",    player: "赤月",   team: "長崎" },
      { title: "連敗",             value: "10連敗",    player: "神尾",   team: "流山",  note: "継続中" },
      { title: "ノーヒットノーラン", player: "才木",   team: "梅田",   date: "9月11日", opponent: "博多" },
      { title: "1試合最多奪三振",  value: "21個",      player: "忍野",   team: "川崎",   date: "5月28日", opponent: "京都" },
    ],
    "野手": [
      { title: "連続試合出塁",     value: "29試合",    player: "夏木",   team: "博多" },
      { title: "連続打数安打",     value: "8打数",     player: "菅",     team: "梅田" },
      { title: "猛打賞",           value: "19回",      player: "仲村",   team: "流山" },
      { title: "連続打席無安打",   value: "46打席",    player: "追山",   team: "川崎" },
      { title: "連続打席無安打",   value: "46打席",    player: "安田",   team: "流山" },
    ],
  },
};

// ---------- apply -------------------------------------------------------

function upsertYear(list, entry) {
  const i = list.findIndex((e) => e.year === entry.year);
  if (i >= 0) list[i] = entry;
  else list.push(entry);
}

const titles = read("titles.json");
const awards = read("awards.json");
const monthly = read("monthlyMvp.json");
const standings = read("standings.json");

upsertYear(titles, NEW_TITLES);
upsertYear(awards, NEW_AWARDS);
upsertYear(monthly, NEW_MONTHLY);
const s30 = standings.find((e) => e.year === 2030);
if (!s30) throw new Error("standings.json 2030 not found");
s30.gameRecords = GAME_RECORDS;

titles.sort((a, b) => a.year - b.year);
awards.sort((a, b) => a.year - b.year);
monthly.sort((a, b) => a.year - b.year);

write("titles.json", titles);
write("awards.json", awards);
write("monthlyMvp.json", monthly);
write("standings.json", standings);

// ---------- validate team references ------------------------------------

const teams = read("teams.json");
const known = new Set(teams.flatMap((t) => [t.name, t.shortName, t.id].filter(Boolean)));
function allTeamRefs() {
  const refs = [];
  for (const row of [...SE_TITLES, ...PA_TITLES]) refs.push(["titles", row.team, row.player]);
  for (const lg of Object.values(NEW_AWARDS.leagues))
    for (const cat of Object.values(lg))
      for (const r of cat) refs.push(["awards", r.team, r.player]);
  for (const lg of Object.values(NEW_MONTHLY.leagues))
    for (const role of Object.values(lg))
      for (const r of role) refs.push(["monthly", r.team, r.player]);
  for (const lg of Object.values(GAME_RECORDS))
    for (const cat of Object.values(lg))
      for (const r of cat) refs.push(["gameRecords", r.team, r.player]);
  return refs;
}
const bad = allTeamRefs().filter(([, t]) => !known.has(t));
console.log("== team reference check ==");
console.log("  total rows:", allTeamRefs().length, " unresolved:", bad.length);
if (bad.length) for (const [file, t, p] of bad) console.log(`  ${file}: "${t}" (player=${p})`);

console.log("\n== file row counts ==");
console.log("  titles.json 2030: セ", SE_TITLES.length, "/ パ", PA_TITLES.length);
console.log("  awards.json 2030: セ GG", NEW_AWARDS.leagues["セ・リーグ"]["ゴールデングラブ"].length,
  "/ パ GG", NEW_AWARDS.leagues["パ・リーグ"]["ゴールデングラブ"].length);
console.log("  monthlyMvp.json 2030: セ 投手×打者", NEW_MONTHLY.leagues["セ・リーグ"]["投手"].length, "/", NEW_MONTHLY.leagues["セ・リーグ"]["打者"].length,
  "  パ 投手×打者", NEW_MONTHLY.leagues["パ・リーグ"]["投手"].length, "/", NEW_MONTHLY.leagues["パ・リーグ"]["打者"].length);
console.log("  gameRecords: セ 投/野", GAME_RECORDS["セ・リーグ"]["投手"].length, "/", GAME_RECORDS["セ・リーグ"]["野手"].length,
  "  パ 投/野", GAME_RECORDS["パ・リーグ"]["投手"].length, "/", GAME_RECORDS["パ・リーグ"]["野手"].length);
