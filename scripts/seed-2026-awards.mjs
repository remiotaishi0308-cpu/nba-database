// Replace the 2026 entry of titles.json and upsert 2026 into awards.json.
// Player names / team names are written EXACTLY as the user specified, even
// when the team assignment crosses leagues (e.g. 梅田 appears under セGG).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/data");
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
const writeJson = (f, v) =>
  fs.writeFileSync(path.join(ROOT, f), JSON.stringify(v, null, 2) + "\n", "utf8");

// Helper: flatten a {title, value, recipients: [{player, team}]} spec into rows.
function expandTied(spec) {
  return spec.recipients.map((r) => {
    const row = { title: spec.title, player: r.player, team: r.team };
    if (spec.value) row.value = spec.value;
    return row;
  });
}
function single(title, player, team, value) {
  return expandTied({ title, value, recipients: [{ player, team }] });
}

// ---- titles.json 2026 ----

const SE_TITLES_2026 = [
  ...single("MVP",          "辻",      "渋谷"),
  ...single("新人王",        "竹中",    "杜王"),
  ...single("最優秀防御率",   "辻",      "渋谷", "1.39"),
  ...expandTied({
    title: "最多勝", value: "17勝",
    recipients: [
      { player: "瓜生", team: "渋谷" },
      { player: "辻",   team: "渋谷" },
    ],
  }),
  ...single("最多奪三振",     "有吉",    "北海道", "233個"),
  ...expandTied({
    title: "勝率第1位", value: ".850",
    recipients: [
      { player: "辻",   team: "渋谷" },
      { player: "瓜生", team: "渋谷" },
    ],
  }),
  ...single("最多セーブ",     "岡崎",    "広島", "34セーブ"),
  ...single("最優秀中継ぎ",   "亀梨",    "渋谷", "40HP"),
  ...single("首位打者",       "杉本 亨", "難波", ".306"),
  ...expandTied({
    title: "本塁打王", value: "30本",
    recipients: [
      { player: "杉本 亨", team: "難波" },
      { player: "染谷",    team: "広島" },
      { player: "竹中",    team: "杜王" },
    ],
  }),
  ...expandTied({
    title: "打点王", value: "86打点",
    recipients: [
      { player: "杉本 亨", team: "難波" },
      { player: "西場",    team: "広島" },
    ],
  }),
  ...single("盗塁王",         "小山",    "広島", "30盗塁"),
  ...expandTied({
    title: "最多安打", value: "160安打",
    recipients: [
      { player: "杉本 亨", team: "難波" },
      { player: "二葉",    team: "広島" },
    ],
  }),
  ...single("最高出塁率",     "二葉",    "広島", ".368"),
];

const PA_TITLES_2026 = [
  ...single("MVP",            "達本 亜人",     "福知山"),
  ...single("新人王",          "達本 亜人",     "福知山"),
  ...single("沢村賞",          "達本 亜人",     "福知山"),
  ...single("最優秀防御率",     "佐伯",          "梅田", "1.35"),
  ...single("最多勝",          "達本 亜人",     "福知山", "24勝"),
  ...single("最多奪三振",       "達本 亜人",     "福知山", "292個"),
  ...single("勝率第1位",        "達本 亜人",     "福知山", ".889"),
  ...single("最多セーブ",       "佐々木 麟太郎", "横浜", "34S"),
  ...single("最優秀中継ぎ",     "津島",          "川崎", "33HP"),
  ...single("首位打者",         "仲村",          "流山", ".312"),
  ...single("本塁打王",         "田仲",          "博多", "39本"),
  ...single("打点王",           "久保",          "新潟", "98打点"),
  ...single("盗塁王",           "千石",          "博多", "30盗塁"),
  ...single("最多安打",         "仲村",          "流山", "188本"),
  ...single("最高出塁率",       "仲村",          "流山", ".380"),
];

const NEW_TITLES_2026 = {
  year: 2026,
  leagues: {
    "セ・リーグ": SE_TITLES_2026,
    "パ・リーグ": PA_TITLES_2026,
  },
};

// ---- awards.json 2026 ----

const NEW_AWARDS_2026 = {
  year: 2026,
  leagues: {
    "セ・リーグ": {
      "ベストナイン": [
        { position: "投手",   player: "辻",        team: "渋谷"   },
        { position: "捕手",   player: "二葉",      team: "広島"   },
        { position: "一塁手", player: "三根",      team: "京都"   },
        { position: "二塁手", player: "竹中",      team: "杜王"   },
        { position: "三塁手", player: "飯島達郎",  team: "愛知"   },
        { position: "遊撃手", player: "山城",      team: "北海道" },
        { position: "外野手", player: "嶋根",      team: "杜王"   },
        { position: "外野手", player: "越智",      team: "広島"   },
        { position: "外野手", player: "田之上",    team: "京都"   },
      ],
      "ゴールデングラブ": [
        { position: "投手",   player: "辻",        team: "渋谷" },
        { position: "捕手",   player: "二葉",      team: "広島" },
        { position: "一塁手", player: "三根",      team: "京都" },
        { position: "二塁手", player: "杉本亨",    team: "難波" },
        { position: "三塁手", player: "飯島達",    team: "梅田" },
        { position: "遊撃手", player: "染谷",      team: "広島" },
        { position: "外野手", player: "西場",      team: "広島" },
        { position: "外野手", player: "辰巳",      team: "梅田" },
        { position: "外野手", player: "早乙女",    team: "京都" },
      ],
    },
    "パ・リーグ": {
      "ベストナイン": [
        { position: "投手",   player: "達本 亜人",     team: "福知山" },
        { position: "捕手",   player: "大城 将九",     team: "福知山" },
        { position: "一塁手", player: "安田 恭平",     team: "流山"   },
        { position: "二塁手", player: "加藤 光一郎",   team: "新潟"   },
        { position: "三塁手", player: "落合 博満",     team: "川崎"   },
        { position: "遊撃手", player: "梅崎 悟",       team: "梅田"   },
        { position: "外野手", player: "岡本 司",       team: "新潟"   },
        { position: "外野手", player: "田仲 龍治",     team: "博多"   },
        { position: "外野手", player: "重松 龍人",     team: "流山"   },
        { position: "DH",     player: "広池",          team: "川崎"   },
      ],
      "ゴールデングラブ": [
        { position: "投手",   player: "達本",       team: "福知山" },
        { position: "捕手",   player: "笠松",       team: "長崎"   },
        { position: "一塁手", player: "波田",       team: "福知山" },
        { position: "二塁手", player: "加藤",       team: "長崎"   },
        { position: "三塁手", player: "久保",       team: "長崎"   },
        { position: "遊撃手", player: "蜂須賀",     team: "長崎"   },
        { position: "外野手", player: "仲村",       team: "流山"   },
        { position: "外野手", player: "田仲",       team: "博多"   },
        { position: "外野手", player: "西園寺",     team: "横浜"   },
      ],
    },
  },
};

function upsertByYear(list, entry) {
  const i = list.findIndex((e) => e.year === entry.year);
  if (i >= 0) list[i] = entry;
  else list.push(entry);
}

const titles = readJson("titles.json");
const awards = readJson("awards.json");

upsertByYear(titles, NEW_TITLES_2026);
upsertByYear(awards, NEW_AWARDS_2026);

titles.sort((a, b) => a.year - b.year);
awards.sort((a, b) => a.year - b.year);

writeJson("titles.json", titles);
writeJson("awards.json", awards);

console.log("titles.json years:", titles.map((e) => e.year));
console.log("awards.json years:", awards.map((e) => e.year));
console.log("titles 2026 row counts:",
  Object.fromEntries(Object.entries(NEW_TITLES_2026.leagues).map(([k, v]) => [k, v.length])));
console.log("awards 2026 row counts:",
  Object.fromEntries(Object.entries(NEW_AWARDS_2026.leagues).map(([k, v]) =>
    [k, Object.fromEntries(Object.entries(v).map(([cat, arr]) => [cat, arr.length]))])));
