// Attach 2031 personalStats to standings.json[year=2031]. Other 2031 fields
// are preserved untouched.
import fs from "node:fs";
import path from "node:path";

const FILE = path.resolve("src/data/standings.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const PA = [
  // ── 流山シーマリナーズ (1位・日本シリーズ出場)
  { team: "流山",   player: "藤本 ダニエル", position: "投手", record: "40HP(最優秀中継ぎ)",
    comment: "チーム最大の武器である「中継ぎ力」の象徴として、見事に最優秀中継ぎを獲得しました。" },
  { team: "流山",   player: "佐藤 英智",     position: "投手", record: "16勝、防御率1.19",
    comment: "ベストナインとゴールデングラブ賞(投手)を獲得。安定感抜群の大黒柱として優勝に大きく貢献しました。" },
  { team: "流山",   player: "小金井",         position: "野手", record: "24本塁打",
    comment: "ルーキーながら24本塁打とブレイクし、ゴールデングラブ賞(二塁手)にも輝きました。" },
  { team: "流山",   player: "仮良真",         position: "野手", record: "ベストナイン(指名打者)",
    comment: "投高打低の極限環境において、両リーグ通じて唯一3割台をキープした時期もあるなど、最強の得点源として活躍しました。" },
  { team: "流山",   player: "堂上",           position: "野手", record: "22本塁打",
    comment: "小金井とともに「20本塁打コンビ」として破壊力をもたらし、ゴールデングラブ賞(遊撃手)を獲得しました。" },
  { team: "流山",   player: "重松",           position: "野手", record: "ゴールデングラブ賞(外野手)", comment: "" },
  { team: "流山",   player: "柊",             position: "投手", record: "14勝、防御率2.16", comment: "" },

  // ── 新潟イプシロンズ (2位)
  { team: "新潟",   player: "荒賀",           position: "野手", record: "ゴールデングラブ賞(外野手)", comment: "" },
  { team: "新潟",   player: "一場",           position: "投手", record: "37HP", comment: "" },
  { team: "新潟",   player: "音無",           position: "投手", record: "25セーブ", comment: "" },
  { team: "新潟",   player: "堀米",           position: "投手", record: "防御率0.16",
    comment: "黒川(防御率0.58)とともに鉄壁の中継ぎ陣を形成し、リード時の圧倒的な強さを支えました。" },
  { team: "新潟",   player: "久保",           position: "野手", record: "16本塁打、OPS.756", comment: "" },
  { team: "新潟",   player: "中山",           position: "野手", record: "OPS.800", comment: "" },

  // ── 長崎マリンフォース (3位)
  { team: "長崎",   player: "赤月",           position: "投手", record: "防御率1.09(最優秀防御率)",
    comment: "防御率1点台前半という圧倒的な投球で最優秀防御率を獲得し、エースとして君臨しました。" },
  { team: "長崎",   player: "笠松",           position: "野手", record: "145安打(最多安打)",
    comment: "最多安打のタイトルを獲得するとともに、ゴールデングラブ賞(捕手)にも選出されました。" },
  { team: "長崎",   player: "小林",           position: "野手", record: "27本塁打",
    comment: "持ち前の一発でチームを牽引し、ベストナイン(遊撃手)に輝きました。" },
  { team: "長崎",   player: "氷上",           position: "野手", record: "ゴールデングラブ賞(外野手)", comment: "" },
  { team: "長崎",   player: "赤井",           position: "野手", record: "18本塁打、打率.250", comment: "" },

  // ── 福知山ネクサスナイン (4位)
  { team: "福知山", player: "達本",           position: "投手", record: "勝率.867(勝率第1位)、12勝、250奪三振",
    comment: "驚異的な奪三振能力と高い勝率を見せつけ、勝率第1位投手賞を獲得しました。" },
  { team: "福知山", player: "安富",           position: "野手", record: "78打点(打点王)、31本塁打",
    comment: "勝負強さを発揮し、見事にパ・リーグの打点王を獲得しました。" },
  { team: "福知山", player: "深川",           position: "野手", record: "19本塁打、OPS.775",
    comment: "打線の核として活躍し、ベストナイン(外野手)に選出されました。" },
  { team: "福知山", player: "定岡",           position: "野手", record: "ベストナイン(二塁手)", comment: "" },
  { team: "福知山", player: "曽田",           position: "投手", record: "34HP", comment: "" },
  { team: "福知山", player: "中井",           position: "野手", record: "19本塁打、56打点", comment: "" },

  // ── 梅田スラッガーズ (5位)
  { team: "梅田",   player: "柴山",           position: "野手", record: "ベストナイン(三塁手)", comment: "" },
  { team: "梅田",   player: "熊谷",           position: "投手", record: "11勝、防御率1.77",
    comment: "佐伯(10勝)、井下(11勝)とともに強力な先発3本柱を形成しました。" },
  { team: "梅田",   player: "本郷",           position: "野手", record: "16本塁打", comment: "" },

  // ── 川崎ウインドブレイカーズ (6位)
  { team: "川崎",   player: "忍野",           position: "投手", record: "16勝、259奪三振、防御率1.24",
    comment: "チームが低迷し援護がない中でも16勝を挙げ、多くの三振を奪う「神」がかった投球を見せました。" },
  { team: "川崎",   player: "大崎",           position: "投手", record: "15セーブ、防御率0.53", comment: "" },
  { team: "川崎",   player: "北条",           position: "野手", record: "ベストナイン(一塁手)", comment: "" },
  { team: "川崎",   player: "栗山",           position: "野手", record: "15本塁打", comment: "" },

  // ── 博多アクアリアス (7位)
  { team: "博多",   player: "田仲",           position: "野手", record: "30本塁打(本塁打王)",
    comment: "低打率ながらも一発の長打力を発揮し、パ・リーグの本塁打王を獲得。ベストナイン(外野手)にも選出されました。" },
  { team: "博多",   player: "夏木",           position: "野手", record: "打率.275、OPS.833",
    comment: "孤軍奮闘の働きを見せ、ベストナイン(一塁手)、ゴールデングラブ賞(一塁手)のダブル受賞を果たしました。" },
  { team: "博多",   player: "松野",           position: "野手", record: "OPS.743", comment: "" },
  { team: "博多",   player: "片桐",           position: "投手", record: "10勝、防御率2.87", comment: "" },

  // ── 横浜ベイクルーザーズ (8位)
  { team: "横浜",   player: "古林",           position: "投手", record: "327奪三振(最多奪三振)",
    comment: "ルーキーにして327個もの三振を奪う規格外の活躍を見せ、最多奪三振を獲得すると共にシーズンMVPと新人王をダブル受賞しました。" },
  { team: "横浜",   player: "草野",           position: "野手", record: "打率.278(首位打者)、最高出塁率.349、26本塁打、OPS.877",
    comment: "最下位チームにいながら三冠王を狙える位置にいた「最強打者」。打率と出塁率の2冠に輝き、ベストナイン・ゴールデングラブ賞(ともに捕手)も獲得しました。" },
  { team: "横浜",   player: "宮川",           position: "投手", record: "19勝(最多勝)",
    comment: "チームが最下位に沈む中で19勝を挙げ、見事に最多勝を獲得しました。" },
  { team: "横浜",   player: "佐々木",         position: "投手", record: "31セーブ(最多セーブ)、防御率0.55",
    comment: "リードして9回を迎えれば勝ち確実の絶対的守護神として最多セーブを獲得しました。" },
  { team: "横浜",   player: "西園寺",         position: "野手", record: "32盗塁(盗塁王)", comment: "" },
  { team: "横浜",   player: "権田",           position: "野手", record: "19本塁打(ベストナイン外野手)", comment: "" },
  { team: "横浜",   player: "大杉",           position: "野手", record: "ゴールデングラブ賞(三塁手)", comment: "" },
];

const SE = [
  // ── 愛知プロミネンス (1位・日本シリーズ優勝)
  { team: "愛知",   player: "辰己",           position: "野手", record: "打率.270、16本塁打、OPS.911",
    comment: "投高打低の中でOPS.900超えという驚異的な数値を残し、打線を力強く牽引。ベストナイン(外野手)に選出されました。" },
  { team: "愛知",   player: "押下",           position: "投手", record: "15勝", comment: "" },
  { team: "愛知",   player: "飯山",           position: "投手", record: "15勝",
    comment: "押下とともに15勝を挙げ、強力なダブルエースとしてチームの完全優勝に貢献しました。" },
  { team: "愛知",   player: "森",             position: "投手", record: "14勝", comment: "" },
  { team: "愛知",   player: "佃",             position: "投手", record: "13勝", comment: "" },
  { team: "愛知",   player: "加藤",           position: "投手", record: "43試合登板、防御率1.04", comment: "" },
  { team: "愛知",   player: "松村",           position: "野手", record: "16本塁打、OPS.807", comment: "" },
  { team: "愛知",   player: "宇尾野",         position: "野手", record: "OPS.791", comment: "" },

  // ── 清澄ホワイトリバーズ (2位)
  { team: "清澄",   player: "大森",           position: "投手", record: "防御率1.13(最優秀防御率)",
    comment: "セ・リーグ唯一の防御率0点台を記録した時期もあるなど圧倒的な投球で最優秀防御率を獲得。ベストナイン・ゴールデングラブ賞(ともに投手)を受賞しました。" },
  { team: "清澄",   player: "津村",           position: "野手", record: "23本塁打(本塁打王)",
    comment: "打てない環境の中で見事にセ・リーグの本塁打王を獲得しました。" },
  { team: "清澄",   player: "本庄",           position: "野手", record: "24盗塁(盗塁王)", comment: "" },
  { team: "清澄",   player: "古門",           position: "野手", record: "ゴールデングラブ賞(外野手)", comment: "" },
  { team: "清澄",   player: "磯宮",           position: "野手", record: "ゴールデングラブ賞(一塁手)", comment: "" },
  { team: "清澄",   player: "比嘉",           position: "投手", record: "48試合登板、防御率0.56", comment: "" },

  // ── 広島セントラルレイカーズ (3位)
  { team: "広島",   player: "菅井",           position: "投手", record: "19勝(最多勝)、防御率1.13(最優秀防御率)、勝率.905(勝率第1位)",
    comment: "最多勝・最優秀防御率・勝率第1位の投手三冠を獲得。シーズンMVPと沢村賞を総なめにする大活躍でした。" },
  { team: "広島",   player: "呉",             position: "投手", record: "54HP(最優秀中継ぎ)、防御率0.25",
    comment: "防御率0点台の神がかった投球で54HPを記録し、最優秀中継ぎを獲得しました。" },
  { team: "広島",   player: "岡崎",           position: "投手", record: "32セーブ", comment: "" },
  { team: "広島",   player: "小山",           position: "野手", record: "OPS.834",
    comment: "強力打線の中軸として機能し、ベストナイン・ゴールデングラブ賞(ともに二塁手)を獲得しました。" },
  { team: "広島",   player: "越智",           position: "野手", record: "17本塁打、OPS.774(ゴールデングラブ賞三塁手)", comment: "" },
  { team: "広島",   player: "識",             position: "野手", record: "ゴールデングラブ賞(外野手)", comment: "" },

  // ── 渋谷アーバンスターズ (4位)
  { team: "渋谷",   player: "大勢",           position: "投手", record: "29セーブ(最多セーブ)",
    comment: "渋谷の守護神として機能し、セ・リーグの最多セーブを獲得しました。" },
  { team: "渋谷",   player: "峰",             position: "投手", record: "新人王",
    comment: "チームのAクラス入りに貢献し、見事に新人王を獲得しました。" },
  { team: "渋谷",   player: "百合草",         position: "野手", record: "21本塁打",
    comment: "リーグ屈指の長距離砲として存在感を示し、ベストナイン(外野手)に選出されました。" },
  { team: "渋谷",   player: "司馬",           position: "野手", record: "ベストナイン(捕手)", comment: "" },
  { team: "渋谷",   player: "麻布",           position: "投手", record: "67試合登板、33HP、防御率0.27", comment: "" },
  { team: "渋谷",   player: "日暮",           position: "野手", record: "16本塁打", comment: "" },

  // ── 杜王スピリットフェニックス (5位)
  { team: "杜王",   player: "三津",           position: "投手", record: "8勝8敗、防御率1.03",
    comment: "防御率1点台前半という見事な成績ながら、極端な貧打の援護に恵まれず8勝にとどまった「不運なエース」です。" },
  { team: "杜王",   player: "大久保",         position: "投手", record: "31HP、防御率0.56", comment: "" },
  { team: "杜王",   player: "田部",           position: "野手", record: "OPS.728", comment: "" },
  { team: "杜王",   player: "竹中",           position: "野手", record: "ゴールデングラブ賞(二塁手)", comment: "" },

  // ── 京都ミリオンアッシュ (6位)
  { team: "京都",   player: "眉村",           position: "投手", record: "284奪三振(最多奪三振)、12勝",
    comment: "ドクターKとして三振の山を築き、最多奪三振のタイトルを獲得しました。" },
  { team: "京都",   player: "早乙女",         position: "野手", record: "打率.272(首位打者)、最高出塁率.343",
    comment: "打線の軸として機能し、首位打者と最高出塁率の2冠に輝きました。" },
  { team: "京都",   player: "舟田",           position: "野手", record: "70打点(打点王)",
    comment: "ゴールデングラブ賞(捕手)を獲得するとともに、勝負強さを発揮して打点王を獲得しました。" },
  { team: "京都",   player: "太田",           position: "投手", record: "201奪三振", comment: "" },

  // ── 難波ボルテッカーズ (7位)
  { team: "難波",   player: "杉本",                       position: "野手", record: "148安打(最多安打)",
    comment: "コンスタントにヒットを積み重ね、最多安打を獲得しました。" },
  { team: "難波",   player: "満丸",                       position: "野手", record: "打率.274、OPS.856",
    comment: "低打率シーズンにおいて傑出したバットコントロールを見せ、ベストナイン(外野手)に選出されました。" },
  { team: "難波",   player: "ハリウッドザコシショウ",     position: "野手", record: "ベストナイン(三塁手)", comment: "" },
  { team: "難波",   player: "幕張",                       position: "投手", record: "23セーブ、防御率0.97", comment: "" },
  { team: "難波",   player: "谷沢",                       position: "投手", record: "10勝、防御率2.21", comment: "" },

  // ── 北海道レイブンクロウズ (8位)
  { team: "北海道", player: "嵯峨",           position: "野手", record: "ベストナイン(一塁手)", comment: "" },
  { team: "北海道", player: "福島",           position: "野手", record: "13本塁打",
    comment: "若手ながらレギュラーに定着し、ベストナイン・ゴールデングラブ賞(ともに遊撃手)のダブル受賞を果たしました。" },
  { team: "北海道", player: "角田",           position: "投手", record: "24HP、防御率0.37", comment: "" },
  { team: "北海道", player: "塙",             position: "野手", record: "ゴールデングラブ賞(捕手)", comment: "" },
  { team: "北海道", player: "末田",           position: "野手", record: "ゴールデングラブ賞(外野手)", comment: "" },
];

const target = data.find((e) => e.year === 2031);
if (!target) throw new Error("standings.json 2031 not found");

target.personalStats = {
  "セ・リーグ": { 個人成績: SE },
  "パ・リーグ": { 個人成績: PA },
};

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

// ---- validation ----------------------------------------------------------

const teams = JSON.parse(fs.readFileSync(path.resolve("src/data/teams.json"), "utf8"));
const known = new Set(teams.flatMap((t) => [t.name, t.shortName, t.id].filter(Boolean)));
function checkTeams(label, list) {
  const bad = list.filter((r) => !known.has(r.team));
  console.log(
    `${label}: rows=${list.length}, unresolved teams=${bad.length}` +
      (bad.length ? " — " + bad.map((r) => `${r.team}/${r.player}`).join(", ") : "")
  );
}
console.log("2031 personalStats seeded:");
console.log("  top-level keys:", Object.keys(target).join(", "));
checkTeams("  セ・リーグ", SE);
checkTeams("  パ・リーグ", PA);

// per-team summary
const summarize = (list) => {
  const byTeam = {};
  for (const r of list) (byTeam[r.team] ??= []).push(r.player);
  for (const [t, players] of Object.entries(byTeam)) {
    console.log(`    ${t.padEnd(10)} ${players.length} — ${players.join(", ")}`);
  }
};
console.log("\nセ breakdown:");
summarize(SE);
console.log("\nパ breakdown:");
summarize(PA);
