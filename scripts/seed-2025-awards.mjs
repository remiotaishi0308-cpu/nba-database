// Replace the 2025 entry of monthlyMvp.json and awards.json with hand-curated
// data. Other years (e.g. 2029) are preserved.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/data");
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
const writeJson = (f, v) =>
  fs.writeFileSync(path.join(ROOT, f), JSON.stringify(v, null, 2) + "\n", "utf8");

const NEW_MONTHLY_2025 = {
  year: 2025,
  leagues: {
    "セ・リーグ": {
      "投手": [
        { month: "4月", player: "菅井",   team: "広島"   },
        { month: "5月", player: "有吉",   team: "北海道" },
        { month: "6月", player: "有吉",   team: "北海道" },
        { month: "7月", player: "山崎伊", team: "渋谷"   },
        { month: "8月", player: "滝川",   team: "難波"   },
        { month: "9月", player: "滝川",   team: "難波"   },
      ],
      "打者": [
        { month: "4月", player: "古門",   team: "清澄" },
        { month: "5月", player: "早乙女", team: "京都" },
        { month: "6月", player: "杉本亨", team: "難波" },
        { month: "7月", player: "飯島",   team: "愛知" },
        { month: "8月", player: "染谷",   team: "広島" },
        { month: "9月", player: "古門",   team: "清澄" },
      ],
    },
    "パ・リーグ": {
      "投手": [
        { month: "4月", player: "古矢",   team: "横浜" },
        { month: "5月", player: "佐藤英", team: "流山" },
        { month: "6月", player: "稲葉",   team: "横浜" },
        { month: "7月", player: "赤月",   team: "長崎" },
        { month: "8月", player: "柊",     team: "流山" },
        { month: "9月", player: "宮川",   team: "横浜" },
      ],
      "打者": [
        { month: "4月", player: "大杉",   team: "横浜" },
        { month: "5月", player: "仲村",   team: "流山" },
        { month: "6月", player: "椿",     team: "梅田" },
        { month: "7月", player: "加藤",   team: "新潟" },
        { month: "8月", player: "仲村",   team: "流山" },
        { month: "9月", player: "久保",   team: "新潟" },
      ],
    },
  },
};

const NEW_AWARDS_2025 = {
  year: 2025,
  leagues: {
    "セ・リーグ": {
      "ベストナイン": [
        { position: "投手",   player: "滝川",   team: "難波" },
        { position: "捕手",   player: "二葉",   team: "広島" },
        { position: "一塁手", player: "梶谷",   team: "難波" },
        { position: "二塁手", player: "小山",   team: "広島" },
        { position: "三塁手", player: "飯島",   team: "愛知" },
        { position: "遊撃手", player: "末光",   team: "愛知" },
        { position: "外野手", player: "古門",   team: "清澄" },
        { position: "外野手", player: "早乙女", team: "京都" },
        { position: "外野手", player: "平松",   team: "渋谷" },
      ],
      "ゴールデングラブ": [
        { position: "投手",   player: "菅井",   team: "広島"   },
        { position: "捕手",   player: "二葉",   team: "広島"   },
        { position: "一塁手", player: "牧",     team: "清澄"   },
        { position: "二塁手", player: "菊丸",   team: "清澄"   },
        { position: "三塁手", player: "飯島",   team: "愛知"   },
        { position: "遊撃手", player: "末光",   team: "愛知"   },
        { position: "外野手", player: "古門",   team: "清澄"   },
        { position: "外野手", player: "末田",   team: "北海道" },
        { position: "外野手", player: "津村",   team: "清澄"   },
      ],
    },
    "パ・リーグ": {
      "ベストナイン": [
        { position: "投手",   player: "佐藤英", team: "流山"   },
        { position: "捕手",   player: "笠松",   team: "長崎"   },
        { position: "一塁手", player: "横森",   team: "博多"   },
        { position: "二塁手", player: "大杉",   team: "横浜"   },
        { position: "三塁手", player: "奥久慈", team: "福知山" },
        { position: "遊撃手", player: "小林",   team: "長崎"   },
        { position: "外野手", player: "仲村",   team: "流山"   },
        { position: "外野手", player: "田仲",   team: "博多"   },
        { position: "外野手", player: "仮良真", team: "流山"   },
        { position: "DH",     player: "波田",   team: "福知山" },
      ],
      "ゴールデングラブ": [
        { position: "投手",   player: "佐藤英", team: "流山"   },
        { position: "捕手",   player: "笠松",   team: "長崎"   },
        { position: "一塁手", player: "平出",   team: "福知山" },
        { position: "二塁手", player: "加藤",   team: "新潟"   },
        { position: "三塁手", player: "大前",   team: "流山"   },
        { position: "遊撃手", player: "小林",   team: "長崎"   },
        { position: "外野手", player: "岡本",   team: "新潟"   },
        { position: "外野手", player: "田仲",   team: "博多"   },
        { position: "外野手", player: "椿",     team: "梅田"   },
      ],
    },
  },
};

function upsertByYear(list, entry) {
  const i = list.findIndex((e) => e.year === entry.year);
  if (i >= 0) list[i] = entry;
  else list.push(entry);
}

const monthly = readJson("monthlyMvp.json");
const awards  = readJson("awards.json");

upsertByYear(monthly, NEW_MONTHLY_2025);
upsertByYear(awards,  NEW_AWARDS_2025);

monthly.sort((a, b) => a.year - b.year);
awards.sort((a, b) => a.year - b.year);

writeJson("monthlyMvp.json", monthly);
writeJson("awards.json",     awards);

console.log("monthlyMvp.json years:", monthly.map((e) => e.year));
console.log("awards.json years:",     awards.map((e) => e.year));
