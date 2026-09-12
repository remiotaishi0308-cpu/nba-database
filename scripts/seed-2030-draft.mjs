// Seed 2030 draft picks into drafts.json. Existing 2025 / 2026 entries are
// preserved. Team names are normalized to teams.json canonical full names so
// the lookup (getTeamByName) resolves consistently.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/data");
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
const write = (f, v) =>
  fs.writeFileSync(path.join(ROOT, f), JSON.stringify(v, null, 2) + "\n", "utf8");

const DRAFT_2030 = {
  "流山シーマリナーズ": [
    { round: 1, name: "藤本 ダニエル", position: "投手",   type: "高校生" },
    { round: 2, name: "郡 慶次",       position: "投手",   type: "高校生" },
    { round: 3, name: "青松 竜輝",     position: "投手",   type: "大学生" },
    { round: 4, name: "小金井 翠",     position: "内野手", type: "高校生" },
    { round: 5, name: "須永 愛琉",     position: "投手",   type: "高校生" },
    { round: 6, name: "屯隅 峻平",     position: "内野手", type: "高校生" },
  ],
  "渋谷アーバンスターズ": [
    { round: 1, name: "峰 荘介",       position: "投手",   type: "高校生" },
    { round: 2, name: "左近寺 右京",   position: "外野手", type: "高校生" },
    { round: 3, name: "折端 啓",       position: "外野手", type: "高校生" },
    { round: 4, name: "西岡 祐介",     position: "投手",   type: "大学生" },
    { round: 5, name: "的場 斗碧",     position: "投手",   type: "大学生" },
    { round: 6, name: "相生 孝輔",     position: "外野手", type: "高校生" },
  ],
  "福知山ネクサスナイン": [
    { round: 1, name: "安富 晃作",     position: "捕手",   type: "高校生" },
    { round: 2, name: "定岡 亨太",     position: "内野手", type: "高校生" },
    { round: 3, name: "日高 夏生",     position: "投手",   type: "高校生" },
    { round: 4, name: "大河内 颯介",   position: "投手",   type: "社会人" },
  ],
  "愛知プロミネンス": [
    { round: 1, name: "押下 達也",     position: "投手",   type: "高校生" },
    { round: 2, name: "宮本 大貴",     position: "外野手", type: "高校生" },
    { round: 3, name: "福地 太郎",     position: "外野手", type: "高校生" },
    { round: 4, name: "筒井 凌太郎",   position: "捕手",   type: "社会人" },
    { round: 5, name: "田鍋 孝治",     position: "内野手", type: "高校生" },
    { round: 6, name: "日原 陽生",     position: "捕手",   type: "大学生" },
  ],
  "広島セントラルレイカーズ": [
    { round: 1, name: "三千院 香也",   position: "投手",   type: "高校生" },
    { round: 2, name: "識 好一",       position: "外野手", type: "高校生" },
    { round: 3, name: "正津 啓",       position: "投手",   type: "高校生" },
    { round: 4, name: "土肥 翔平",     position: "外野手", type: "高校生" },
    { round: 5, name: "土生 直弥",     position: "内野手", type: "大学生" },
  ],
  "川崎ウインドブレイカーズ": [
    { round: 1, name: "桐山 琢人",     position: "投手",   type: "高校生"       },
    { round: 2, name: "鶴井 悠成",     position: "投手",   type: "独立リーグ"   },
    { round: 3, name: "釜元 葵生",     position: "外野手", type: "大学生"       },
    { round: 4, name: "門東 太朗",     position: "内野手", type: "高校生"       },
  ],
  "京都ミリオンアッシュ": [
    { round: 1, name: "舟田 晃一朗",          position: "捕手",   type: "高校生" },
    { round: 2, name: "杉野 龍聖",            position: "投手",   type: "社会人" },
    { round: 3, name: "小久保 ブライアン駿",  position: "外野手", type: "高校生" },
    { round: 4, name: "東野 篤志",            position: "外野手", type: "社会人" },
    { round: 5, name: "沢 真斗",              position: "投手",   type: "高校生" },
  ],
  "新潟イプシロンズ": [
    { round: 1, name: "一宮 慶",       position: "投手",   type: "高校生" },
    { round: 2, name: "白鳥 昭人",     position: "捕手",   type: "高校生" },
    { round: 3, name: "荒賀 和彦",     position: "外野手", type: "高校生" },
    { round: 4, name: "牛久 卓真",     position: "外野手", type: "高校生" },
    { round: 5, name: "斑鳩 陽",       position: "内野手", type: "高校生" },
    { round: 6, name: "関根 大晴",     position: "投手",   type: "社会人" },
  ],
  "博多アクアリアス": [
    { round: 1, name: "乙 圭太",       position: "投手", type: "高校生" },
    { round: 2, name: "村田 晃成",     position: "捕手", type: "大学生" },
    { round: 3, name: "真木 晃汰",     position: "捕手", type: "社会人" },
    { round: 4, name: "関口 龍斗",     position: "投手", type: "社会人" },
    { round: 5, name: "曽我部 悠吏",   position: "内野手", type: "社会人" },
  ],
  "北海道レイブンクロウズ": [
    { round: 1, name: "布施 久司",     position: "捕手",   type: "高校生" },
    { round: 2, name: "巣鴨 有人",     position: "外野手", type: "高校生" },
    { round: 3, name: "池田 勇真",     position: "投手",   type: "社会人" },
    { round: 4, name: "秋田 亮輔",     position: "投手",   type: "高校生" },
    { round: 5, name: "山上 颯一郎",   position: "投手",   type: "大学生" },
  ],
  "横浜ベイクルーザーズ": [
    { round: 1, name: "山北 晃太郎",   position: "投手",   type: "社会人" },
    { round: 2, name: "田村 夏希",     position: "投手",   type: "大学生" },
    { round: 3, name: "仁村 陽奏",     position: "投手",   type: "大学生" },
    { round: 4, name: "江戸 翔",       position: "内野手", type: "高校生" },
  ],
  "清澄ホワイトリバーズ": [
    { round: 1, name: "大曽根 空良",   position: "投手",   type: "大学生" },
    { round: 2, name: "磯宮 翔太",     position: "内野手", type: "高校生" },
    { round: 3, name: "福崎 和輝",     position: "投手",   type: "高校生" },
    { round: 4, name: "永沼 湊音",     position: "投手",   type: "大学生" },
  ],
  "難波ボルテッカーズ": [
    { round: 1, name: "池野 俊太",     position: "投手",   type: "社会人" },
    { round: 2, name: "本間 五郎",     position: "内野手", type: "高校生" },
    { round: 3, name: "上田 雄飛",     position: "投手",   type: "大学生" },
    { round: 4, name: "舩木 力",       position: "捕手",   type: "社会人" },
    { round: 5, name: "杉浦 康太",     position: "投手",   type: "高校生" },
  ],
  "長崎マリンフォース": [
    { round: 1, name: "井桁 聡一郎",   position: "投手",   type: "大学生" },
    { round: 2, name: "橋月 啓",       position: "外野手", type: "高校生" },
    { round: 3, name: "宮田 祥",       position: "投手",   type: "大学生" },
    { round: 4, name: "三鷹 智生",     position: "外野手", type: "高校生" },
    { round: 5, name: "関野 龍",       position: "投手",   type: "高校生" },
  ],
  "杜王スピリットフェニックス": [
    { round: 1, name: "宮崎 陽登",     position: "投手",   type: "社会人" },
    { round: 2, name: "東村山 翔太",   position: "内野手", type: "高校生" },
    { round: 3, name: "岩間 そら",     position: "投手",   type: "大学生" },
    { round: 4, name: "立花 孝輔",     position: "外野手", type: "高校生" },
    { round: 5, name: "平塚 航生",     position: "投手",   type: "高校生" },
  ],
  "梅田スラッガーズ": [
    { round: 1, name: "寺本 勇希",     position: "投手",   type: "大学生" },
    { round: 2, name: "千田 諒太",     position: "投手",   type: "社会人" },
    { round: 3, name: "西森 尚輝",     position: "投手",   type: "社会人" },
    { round: 4, name: "荒木 蒼",       position: "内野手", type: "高校生" },
    { round: 5, name: "八木橋 亮佑",   position: "内野手", type: "高校生" },
  ],
};

const drafts = read("drafts.json");
if (!drafts.drafts || typeof drafts.drafts !== "object") {
  throw new Error("drafts.json shape unexpected: missing top-level 'drafts' object");
}
drafts.drafts["2030"] = DRAFT_2030;
write("drafts.json", drafts);

// ---- validation ---------------------------------------------------------

const teams = read("teams.json");
const teamLookup = new Set(
  teams.flatMap((t) => [t.name, t.shortName, t.id].filter(Boolean))
);

let totalPicks = 0;
const unresolved = [];
for (const [teamName, picks] of Object.entries(DRAFT_2030)) {
  totalPicks += picks.length;
  if (!teamLookup.has(teamName)) unresolved.push(teamName);
}

console.log("drafts.json drafts keys:", Object.keys(drafts.drafts));
console.log(`\n2030 teams: ${Object.keys(DRAFT_2030).length}, total picks: ${totalPicks}`);
if (unresolved.length) {
  console.log("UNRESOLVED team names:", unresolved);
} else {
  console.log("all team names resolve via teams.json ✓");
}

console.log("\npicks per team:");
for (const [t, picks] of Object.entries(DRAFT_2030)) {
  console.log(`  ${t.padEnd(16)}  ${picks.length} picks`);
}

// distribution by position / type
const posCount = {};
const typeCount = {};
for (const picks of Object.values(DRAFT_2030)) {
  for (const p of picks) {
    posCount[p.position] = (posCount[p.position] || 0) + 1;
    typeCount[p.type] = (typeCount[p.type] || 0) + 1;
  }
}
console.log("\nposition distribution:", posCount);
console.log("type distribution:", typeCount);
