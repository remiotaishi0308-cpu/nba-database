// Attach the 2030 personalStats block to standings.json[year=2030].
// Other 2030 fields are preserved untouched.
import fs from "node:fs";
import path from "node:path";

const FILE = path.resolve("src/data/standings.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const SE = [
  // ── 難波ボルテッカーズ (リーグ1位)
  {
    team: "難波",
    player: "梶谷",
    position: "野手",
    record: "シーズンMVP",
    comment:
      "難波の守り勝つ野球の中で中軸として機能し、チームのリーグ優勝・連覇に大きく貢献してシーズンMVPに輝きました。",
  },
  {
    team: "難波",
    player: "滝川",
    position: "投手",
    record: "15勝(最多勝)、勝率.714(勝率第1位)",
    comment:
      "有吉、大森と並んで最多勝を獲得し、勝率でも1位タイに輝くなど、優勝チームのエースとして大活躍しました。",
  },
  // ── 杜王スピリットフェニックス (2位)
  {
    team: "杜王",
    player: "藤嶋",
    position: "投手",
    record: "35セーブ(最多セーブ)",
    comment:
      "セ・リーグの最多セーブを獲得し、リーグトップクラスの安定感を誇った投手陣の最後を締めくくりました。",
  },
  // ── 清澄ホワイトリバーズ (3位)
  {
    team: "清澄",
    player: "大森 一輝",
    position: "投手",
    record:
      "15勝(最多勝)、防御率1.37(最優秀防御率)、勝率.714(勝率第1位)、245奪三振、23QS(QS率85.2%)",
    comment:
      "「WRの精密機械」として高い安定感を誇り、投手タイトルを複数獲得。上位争いを演じた清澄ローテーションの中心人物です。",
  },
  // ── 北海道レイブンクロウズ (4位)
  {
    team: "北海道",
    player: "有吉",
    position: "投手",
    record: "15勝(最多勝)、24QS(QS率92.3%)",
    comment:
      "リーグトップクラスのQS数とQS率を記録した「北の完投型エース」。先発の役割を完璧に全うし、最多勝を分け合いました。",
  },
  {
    team: "北海道",
    player: "塙",
    position: "野手",
    record: "23盗塁(盗塁王 ※3名同率)",
    comment:
      "23盗塁を記録して盗塁王のタイトルを分け合い、チームの持ち味である「足」で相手を撹乱しました。",
  },
  {
    team: "北海道",
    player: "平塚",
    position: "野手",
    record: "23盗塁(盗塁王 ※3名同率)",
    comment:
      "23盗塁を記録して盗塁王のタイトルを分け合い、チームの持ち味である「足」で相手を撹乱しました。",
  },
  // ── 愛知プロミネンス (5位)
  {
    team: "愛知",
    player: "古賀",
    position: "野手",
    record: "打率.282(首位打者)、最高出塁率.371、OPS.855、盗塁成功率.750",
    comment:
      "首位打者と最高出塁率を獲得し、OPSもリーグ1位。走っても高い成功率を誇る「GL最強のオールラウンダー」として打線を牽引しました。",
  },
  {
    team: "愛知",
    player: "末光",
    position: "野手",
    record: "23盗塁(盗塁王 ※3名同率)",
    comment: "機動力を発揮し、セ・リーグの盗塁王(3名同率)を獲得しました。",
  },
  {
    team: "愛知",
    player: "佃",
    position: "投手",
    record: "新人王",
    comment:
      "ルーキーながらセ・リーグの新人王に選出され、今後の飛躍を期待させる活躍を見せました。",
  },
  // ── 広島セントラルレイカーズ (6位)
  {
    team: "広島",
    player: "志野",
    position: "野手",
    record: "打率.273、20本塁打、OPS.834、盗塁成功率.750",
    comment:
      "OPSはリーグ2位。本塁打を打ちながら盗塁もこなす「走れるスラッガー」として、攻撃陣の核となる高い身体能力を見せつけました。",
  },
  {
    team: "広島",
    player: "元木",
    position: "野手",
    record: "81打点(打点王)",
    comment:
      "投高打低で得点が入りにくい環境の中、勝負強い打撃を見せて見事に打点王のタイトルを獲得しました。",
  },
  {
    team: "広島",
    player: "二葉",
    position: "野手",
    record: "147安打(最多安打)",
    comment: "コンスタントにヒットを量産し、セ・リーグの最多安打を獲得しました。",
  },
  {
    team: "広島",
    player: "呉",
    position: "投手",
    record: "39HP(最優秀中継ぎ)",
    comment: "最優秀中継ぎを獲得し、広島のリリーフ陣を支える働きを見せました。",
  },
  // ── 京都ミリオンアッシュ (7位)
  {
    team: "京都",
    player: "眉村 健",
    position: "投手",
    record: "257奪三振(最多奪三振)、21QS、奪三振率11.17",
    comment:
      "イニング数を上回る三振を奪う「ドクターK」スタイルで、相手打線をねじ伏せ、見事に最多奪三振のタイトルを獲得しました。",
  },
  // ── 渋谷アーバンスターズ (8位)
  {
    team: "渋谷",
    player: "崎本",
    position: "野手",
    record: "打率.250、28本塁打(本塁打王)、OPS.772",
    comment:
      "チームは最下位ながら本塁打王を獲得。「恐怖の8番打者(?)」として、どこからでも一発が出るアーバンスターズ打線の象徴的な存在でした。",
  },
];

const PA = [
  // ── 長崎マリンフォース (1位)
  {
    team: "長崎",
    player: "赤月 朔",
    position: "投手",
    record:
      "25勝6敗(最多勝)、防御率1.19、335奪三振(最多奪三振)、勝率.806、奪三振率10.23",
    comment:
      "JBU史上最強とも言えるシーズン。圧倒的な奪三振率でマウンドを支配し、日本シリーズでもMVP(防御率0.50、2勝)を獲得。彼が投げれば勝つという絶対的支柱でした。",
  },
  {
    team: "長崎",
    player: "小林",
    position: "野手",
    record: "打率.257、32本塁打、OPS.794",
    comment:
      "投高打低の中でリーグ3位の32本塁打を記録。ここぞという場面での一発が多く「優勝を決める一発屋」としてチームの優勝に貢献しました。",
  },
  {
    team: "長崎",
    player: "笠松",
    position: "野手",
    record: "26本塁打",
    comment:
      "小林らとともに長崎のリーグダントツのチーム本塁打(195本)を支える長距離砲として活躍しました。",
  },
  {
    team: "長崎",
    player: "神宮司",
    position: "野手",
    record: "26本塁打",
    comment:
      "笠松同様、圧倒的な本塁打数を誇る打線の一角を担い、相手投手を粉砕しました。",
  },
  // ── 横浜ベイクルーザーズ (3位)
  {
    team: "横浜",
    player: "草野",
    position: "野手",
    record: "打率.275、34本塁打、85打点(打点王)、OPS.876",
    comment:
      "OPSリーグ1位、打点王も獲得した「リーグ最強の攻撃マシーン」。得点圏での勝負強さが光り、横浜打線を一人で牽引しました。",
  },
  // ── 博多アクアリアス (4位)
  {
    team: "博多",
    player: "尾道",
    position: "投手",
    record: "防御率1.25、40HP",
    comment:
      "HP(ホールドポイント)ランキング1位を獲得し、博多のブルペンを支えました。",
  },
  {
    team: "博多",
    player: "堀池",
    position: "投手",
    record: "防御率0.38、38HP",
    comment:
      "HPランキング2位。防御率0点台というほぼ点を取られない投球で、尾道とともに「博多の鉄壁リレー」を構築しました。",
  },
  // ── 川崎ウインドブレイカーズ (5位)
  {
    team: "川崎",
    player: "忍野",
    position: "投手",
    record:
      "19勝3敗、防御率0.78、QS率100%(27試合登板全試合QS)",
    comment:
      "登板した27試合すべてでクオリティスタートを達成した「ミスター・パーフェクトクオリティ」。打線の援護がない中でも19勝を挙げる精神力と、防御率0点台という歴史的な投球を見せました。",
  },
  // ── 流山シーマリナーズ (8位)
  {
    team: "流山",
    player: "仲村",
    position: "野手",
    record: "打率.282(首位打者)、35本塁打(本塁打王)、72打点、OPS.873",
    comment:
      "チームが最下位に沈む中、首位打者と本塁打王の二冠を獲得。「最下位チームの二冠王」として、長打力と確実性を両立させた稀有な存在でした。",
  },
];

const target = data.find((e) => e.year === 2030);
if (!target) throw new Error("2030 entry not found in standings.json");

target.personalStats = {
  "セ・リーグ": { 個人成績: SE },
  "パ・リーグ": { 個人成績: PA },
};

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

// Sanity-check that every team shortName resolves
const teams = JSON.parse(fs.readFileSync(path.resolve("src/data/teams.json"), "utf8"));
const known = new Set(teams.flatMap((t) => [t.name, t.shortName, t.id].filter(Boolean)));
function checkTeams(label, list) {
  const bad = list.filter((r) => !known.has(r.team));
  console.log(
    `${label}: rows=${list.length}, unresolved teams=${bad.length}` +
      (bad.length ? " — " + bad.map((r) => r.team).join(", ") : "")
  );
}
console.log("2030 personalStats seeded:");
console.log("  top-level keys (preserved):", Object.keys(target).join(", "));
checkTeams("  セ・リーグ", SE);
checkTeams("  パ・リーグ", PA);
