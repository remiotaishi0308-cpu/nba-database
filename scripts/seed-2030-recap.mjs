// Seed 2030 season recap + update 2030 hero/summary images and subCopy.
//   - seasonRecaps.json: add "2030" entry mirroring 2025/2039 schema
//   - standings.json[2030]: set subCopy, heroImageUrl, summaryImages
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/data");
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
const write = (f, v) =>
  fs.writeFileSync(path.join(ROOT, f), JSON.stringify(v, null, 2) + "\n", "utf8");

// ---- Season recap article ----------------------------------------------

const RECAP_2030 = {
  title:
    "【JBU 2030シーズン総括】神話級のエース降臨と「打ち勝つ野球」が死んだ年",
  author: "JBU編集部",
  publishedAt: "2030-11-22",
  headline:
    "2030年のJBUは、後世の野球ファンに「異常なまでの投手圧倒的優位の時代」として語り継がれる歴史的なシーズンとなりました。両リーグを通じて規定打席到達での3割打者がわずか1人しかいない極限の「投高打低」環境の中、「打力」を武器としたチームが次々と駆逐され、「ディフェンス力」こそがペナントを制する唯一の解であることが証明された残酷で美しい1年でした。",
  sections: [
    {
      h: "1. レギュラーシーズン:最大のパラドックス「最強打線が最下位に沈む」",
      p: "この年の最も衝撃的な出来事は、「最も打ったチームが両リーグ揃って最下位になる」というパラドックスが発生したことです。パ・リーグの流山シーマリナーズは、仲村選手が打率.282・35本塁打で首位打者と本塁打王の二冠を獲得し、チーム打率もリーグトップでした。セ・リーグの渋谷アーバンスターズに至っては、崎本選手(28本塁打)を中心にチーム打率・本塁打・得点・OPSのすべてでリーグトップを記録しました。しかし、両チームともに投手陣が崩壊しており、結果はダントツの最下位。どんなにホームランを打とうとも、失点を防げなければ勝てないという「打ち勝つ野球の限界」が残酷なまでに露呈しました。",
    },
    {
      h: "2. セ・リーグ:「極限の盾」でロースコアを制した難波の連覇",
      p: "そんな極端な環境のセ・リーグを制したのは、「守り勝つ野球の完成形」を見せつけた難波ボルテッカーズでした。チーム打率はリーグ6位タイ(.212)と完全に低迷していましたが、滝川投手(15勝)らを中心としたチーム防御率2.57という圧倒的な「盾」の力でロースコアの接戦をモノにし、見事にリーグ連覇を達成しました。MVPには、少ない得点機を確実にモノにしてチームを牽引した梶谷選手が選ばれています。2位の杜王スピリットフェニックスや3位の清澄ホワイトリバーズ(大森投手が最優秀防御率1.37を記録)も強力な投手陣を形成し、上位3チームが1ゲーム差以内にひしめく息詰まる大混戦となりました。",
    },
    {
      h: "3. パ・リーグ:神話的エース・赤月と忍野の伝説",
      p: "一方のパ・リーグでは、現代野球の常識を覆す「神話級のエース」たちが降臨し、個人記録のラッシュに沸きました。川崎の忍野投手は「27試合登板すべてでQS(クオリティスタート)達成」というミスター・パーフェクトぶりを発揮し、防御率0.78という驚異的な記録で最優秀防御率を獲得。しかし、その忍野ですらMVPに届きませんでした。長崎マリンフォースの絶対的エース・赤月投手が、それを上回る「25勝、防御率1.19、335奪三振」というゲームバランスを破壊する投手三冠級の成績を叩き出したからです。赤月の歴史的な快投と、チーム195本塁打という圧倒的な長打力を誇った長崎が、5年ぶりのリーグ制覇を成し遂げました。",
    },
    {
      h: "4. ポストシーズン:頂上決戦とエースの証明",
      p: "迎えたポストシーズン、両リーグの王者はその実力を遺憾なく発揮します。セ・リーグのCSファイナルでは、難波が清澄を相手に3試合でわずか3失点しか許さず、4勝0敗(アドバンテージ含む)の無傷で完勝。パ・リーグのCSファイナルでは、強打の梅田スラッガーズ相手に打ち合いの末、長崎が王者の意地を見せて日本シリーズへ進出しました。",
    },
    {
      h: "日本シリーズ:長崎マリンフォース 4 - 2 難波ボルテッカーズ",
      p: "「最強の投手陣」同士の激突となった頂上決戦。長崎が連勝スタートを切るも、中盤で難波が強力打線を武器に盛り返し、対戦成績は2勝2敗のタイに。しかし、天王山となった第5戦で、長崎のエース・赤月が圧巻の完封勝利を挙げ、シリーズの流れを決定づけます。そのまま第6戦も長崎が5-3で制し、見事に日本一の栄冠に輝きました。日本シリーズMVPには、第1戦の1失点完投勝利と第5戦の完封勝利でチームを牽引した赤月が文句なしで選出され、まさに「赤月のための1年」を締めくくりました。",
    },
    {
      h: "結び",
      p: "2030年シーズンは、野球というスポーツにおいて「投手が打者を完全に圧倒するとどのような世界になるのか」を極限まで見せつけた歴史的な1年でした。記録的貧打に泣いたチームと、それを力でねじ伏せた大エースたちの物語は、JBUの長い歴史の中でも特異な熱狂を放ち続けています。",
    },
  ],
};

const recaps = read("seasonRecaps.json");
recaps["2030"] = RECAP_2030;
write("seasonRecaps.json", recaps);

// ---- standings.json[2030] media metadata update ------------------------

const standings = read("standings.json");
const s30 = standings.find((e) => e.year === 2030);
if (!s30) throw new Error("standings.json 2030 not found");

s30.subCopy = "「守り勝つ野球」の時代到来";
s30.heroImageUrl = "/images/20302.webp";
s30.summaryImages = ["/images/20301.webp", "/images/20303.webp"];
// keep legacy single-image field in sync with first summary image
s30.summaryImageUrl = s30.summaryImages[0];

write("standings.json", standings);

// ---- report ------------------------------------------------------------

console.log("seasonRecaps.json keys:", Object.keys(recaps));
console.log("\n2030 media:");
console.log("  subCopy:        ", s30.subCopy);
console.log("  heroImageUrl:   ", s30.heroImageUrl);
console.log("  summaryImages:  ", s30.summaryImages);
console.log("  summaryImageUrl:", s30.summaryImageUrl);
console.log("\n2030 recap sections:", RECAP_2030.sections.length);
for (const s of RECAP_2030.sections) console.log("  -", s.h);
