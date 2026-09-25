#!/usr/bin/env node
/**
 * シーズンJSONの検証。src/data/seasons/*.json の構造・参照整合性・
 * 順位表の並び/ゲーム差・表彰・ドラフトをチェックする。
 *
 *   npm run validate:season            … 全シーズン
 *   npm run validate:season -- 2026    … 指定シーズンのみ
 */
import fs from "node:fs";
import path from "node:path";

const DIR = "src/data/seasons";
const only = process.argv.slice(2).filter((a) => /^\d{4}$/.test(a));

let errors = 0;
let warns = 0;
const err = (f, m) => { console.error(`  x [${f}] ${m}`); errors++; };
const warn = (f, m) => { console.warn(`  - [${f}] ${m}`); warns++; };

const files = fs.readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .filter((f) => !only.length || only.includes(f.replace(".json", "")))
  .sort();

if (!files.length) { console.error("対象ファイルがありません"); process.exit(1); }

for (const file of files) {
  const full = path.join(DIR, file);
  let d;
  try { d = JSON.parse(fs.readFileSync(full, "utf8")); }
  catch (e) { err(file, `JSONとして読めません: ${e.message}`); continue; }
  console.log(`\n-- ${file}`);

  const expected = Number(file.replace(".json", ""));
  if (d.season !== expected) err(file, `season=${d.season} がファイル名(${expected})と一致しません`);

  const L = d.league || {};
  const confs = L.conferences || [];
  if (!confs.length) err(file, "league.conferences が空です");
  const confKeys = confs.map((c) => c.key);
  const divKeys = new Set();
  confs.forEach((c) => {
    if (!c.key || !c.name) err(file, `conference に key/name がありません`);
    (c.divisions || []).forEach((v) => {
      if (!v.key || !v.name) err(file, `division に key/name がありません (${c.key})`);
      divKeys.add(v.key);
    });
  });
  const po = L.playoff || {};
  ["berths", "directBerths", "playInStart", "playInEnd"].forEach((k) => {
    if (typeof po[k] !== "number") warn(file, `league.playoff.${k} が数値でありません`);
  });
  const roundKeys = (po.rounds || []).map((r) => r.key);
  if (!roundKeys.length) warn(file, "league.playoff.rounds が空です");

  const teams = d.teams || [];
  const abbrs = new Set();
  teams.forEach((t) => {
    if (!t.abbr) return err(file, `teams に abbr がない要素があります`);
    if (abbrs.has(t.abbr)) err(file, `略称が重複: ${t.abbr}`);
    abbrs.add(t.abbr);
    if (!t.name) err(file, `${t.abbr}: name が空です`);
    if (t.conference && !confKeys.includes(t.conference)) err(file, `${t.abbr}: conference="${t.conference}" は league に存在しません`);
    if (t.division && divKeys.size && !divKeys.has(t.division)) err(file, `${t.abbr}: division="${t.division}" は league に存在しません`);
  });
  const ref = (who, v) => { if (v && !abbrs.has(v)) err(file, `${who}: クラブ "${v}" が teams にありません`); };
  // ドラフトには参入予定クラブ（league.incomingTeams）が登場しうるため別扱いにする
  const incoming = new Set(((L.incomingTeams) || []).map((t) => t.abbr).filter(Boolean));
  const refDraft = (who, val) => {
    if (val && !abbrs.has(val) && !incoming.has(val)) {
      err(file, `${who}: クラブ "${val}" が teams / league.incomingTeams にありません`);
    }
  };

  const st = d.standings || {};
  confKeys.forEach((ck) => {
    const rows = st[ck];
    if (!Array.isArray(rows)) return err(file, `standings.${ck} がありません`);
    const seen = new Set();
    rows.forEach((r, i) => {
      ref(`standings.${ck}[${i}]`, r.team);
      if (seen.has(r.team)) err(file, `standings.${ck}: ${r.team} が重複`);
      seen.add(r.team);
      if (typeof r.w !== "number" || typeof r.l !== "number") err(file, `standings.${ck} ${r.team}: w/l が数値でありません`);
    });
    const pr = (x) => (x.w + x.l ? x.w / (x.w + x.l) : 0);
    for (let i = 1; i < rows.length; i++) {
      if (pr(rows[i]) > pr(rows[i - 1]) + 1e-9) {
        err(file, `standings.${ck}: 勝率順ではありません（${rows[i].team} が ${rows[i - 1].team} より上位であるべき）`);
      }
    }
    if (rows.length) {
      const lead = rows[0];
      rows.forEach((r, i) => {
        const calc = ((lead.w - r.w) + (r.l - lead.l)) / 2;
        if (i === 0) {
          if (r.gb && r.gb !== "—" && Number(r.gb) !== 0) warn(file, `standings.${ck}: 首位 ${r.team} の gb は "—" が推奨（現在 "${r.gb}"）`);
        } else if (r.gb && r.gb !== "—" && Math.abs(Number(r.gb) - calc) > 0.051) {
          warn(file, `standings.${ck} ${r.team}: gb="${r.gb}" ですが計算値は ${calc.toFixed(1)}`);
        }
      });
    }
    const marks = (L.clinchMarks || []).map((m) => m.key);
    rows.forEach((r) => {
      if (r.clinch && marks.length && !marks.includes(String(r.clinch).toLowerCase())) {
        err(file, `standings.${ck} ${r.team}: clinch="${r.clinch}" は league.clinchMarks に未定義`);
      }
    });
    if (typeof L.gamesPerTeam === "number") {
      rows.forEach((r) => { if (r.w + r.l > L.gamesPerTeam) err(file, `standings.${ck} ${r.team}: ${r.w + r.l}試合は上限${L.gamesPerTeam}を超えています`); });
    }
  });

  const ps = d.postseason || {};
  const checkSeries = (who, s) => {
    if (!s || typeof s !== "object") return;
    ref(`${who}.a`, s.a); ref(`${who}.b`, s.b);
    if (s.mvp) ref(`${who}.mvp.t`, s.mvp.t);
    const gs = s.games || [];
    if (gs.length && typeof s.as === "number" && typeof s.bs === "number") {
      let aw = 0, bw = 0;
      gs.forEach((g) => {
        const a = Array.isArray(g) ? g[0] : g.a, b = Array.isArray(g) ? g[1] : g.b;
        if (typeof a === "number" && typeof b === "number") { if (a > b) aw++; else if (b > a) bw++; }
      });
      if (aw > s.as || bw > s.bs) err(file, `${who}: 試合結果(${aw}-${bw})がシリーズ成績(${s.as}-${s.bs})を超えています`);
    }
  };
  confKeys.forEach((ck) => {
    const c = (ps.conferences || {})[ck];
    if (!c) return warn(file, `postseason.conferences.${ck} がありません`);
    (c.playIn || []).forEach((s, i) => checkSeries(`playIn.${ck}[${i}]`, s));
    roundKeys.forEach((rk) => ((c.rounds || {})[rk] || []).forEach((s, i) => checkSeries(`${ck}.${rk}[${i}]`, s)));
  });
  if (ps.finals) {
    checkSeries("finals", ps.finals);
    ref("finals.champ", ps.finals.champ);
    if (ps.finals.champ && ps.finals.a && ps.finals.b) {
      const w = ps.finals.as > ps.finals.bs ? ps.finals.a : ps.finals.b;
      if (w !== ps.finals.champ) err(file, `finals: champ="${ps.finals.champ}" が勝者(${w})と一致しません`);
    }
    (ps.finals.path || []).forEach((p, i) => ref(`finals.path[${i}].op`, p.op));
  }
  if (ps.cup) {
    ref("cup.champ", ps.cup.champ); ref("cup.runnerUp", ps.cup.runnerUp);
    if (ps.cup.mvp) ref("cup.mvp.t", ps.cup.mvp.t);
  }

  const aw = d.awards || {};
  const statKeys = (L.statKeys || []).map((s) => s.key);
  const checkStats = (who, stats) => {
    if (!stats) return;
    Object.keys(stats).forEach((k) => {
      if (statKeys.length && !statKeys.includes(k)) warn(file, `${who}: stats.${k} は league.statKeys に未定義（表に出ません）`);
      const v = stats[k];
      if (v != null && typeof v !== "number" && typeof v !== "string") err(file, `${who}: stats.${k} の型が不正`);
    });
  };
  (aw.voting || []).forEach((a) => {
    if (!a.key || !a.label) err(file, `awards.voting に key/label がない要素があります`);
    (a.finalists || []).forEach((f, i) => {
      const who = `awards.${a.key}[${i}]`;
      if (!f.p) err(file, `${who}: 選手名 p が空です`);
      ref(who, f.t); checkStats(who, f.stats);
    });
  });
  (aw.allTeams || []).forEach((g) => (g.tiers || []).forEach((t) => (t.members || []).forEach((m, i) => {
    const who = `awards.${g.key}.${t.tier}[${i}]`;
    if (!m.p) err(file, `${who}: 選手名 p が空です`);
    ref(who, m.t); checkStats(who, m.stats);
  })));
  (aw.statTitles || []).forEach((s) => (s.leaders || []).forEach((r, i) => {
    const who = `awards.statTitles.${s.key}[${i}]`;
    if (!r.p) err(file, `${who}: 選手名 p が空です`);
    ref(who, r.t); checkStats(who, r.stats);
  }));
  (aw.monthly || []).concat(aw.weekly || []).forEach((m, i) => {
    if (m.conf && !confKeys.includes(m.conf)) err(file, `awards.monthly/weekly[${i}]: conf="${m.conf}" が不正`);
    ["mvp", "rookie"].forEach((k) => { if (m[k]) ref(`awards.periodic[${i}].${k}`, m[k].t); });
  });
  if (aw.allStar) {
    (aw.allStar.rosters || []).forEach((r) => ["frontcourt", "backcourt"].forEach((k) =>
      (r[k] || []).forEach((m, j) => { ref(`allStar.${r.team}.${k}[${j}]`, m.t); checkStats(`allStar.${r.team}.${k}[${j}]`, m.stats); })));
    (aw.allStar.events || []).forEach((e, i) => { if (e.winner) ref(`allStar.events[${i}]`, e.winner.t); });
    if (aw.allStar.mvp) ref("allStar.mvp", aw.allStar.mvp.t);
  }
  (aw.postseasonMvp || []).forEach((m, i) => { ref(`postseasonMvp[${i}]`, m.t); checkStats(`postseasonMvp[${i}]`, m.stats); });

  const dr = d.draft;
  if (dr) {
    (dr.lottery || []).forEach((x, i) => refDraft(`draft.lottery[${i}]`, x.team));
    const seenOverall = new Map();
    (dr.picks || []).forEach((pk, i) => {
      const who = `draft.picks[${i}]`;
      refDraft(who, pk.team);
      if (!pk.p) err(file, `${who}: 選手名 p が空です`);
      ["round", "pick", "overall"].forEach((k) => {
        if (pk[k] != null && typeof pk[k] !== "number") err(file, `${who}: ${k} が数値でありません`);
      });
      if (pk.overall != null) {
        if (seenOverall.has(pk.overall)) err(file, `${who}: overall=${pk.overall} が重複（${seenOverall.get(pk.overall)} と）`);
        seenOverall.set(pk.overall, who);
      }
    });
    ((dr.expansion && dr.expansion.picks) || []).forEach((pk, i) => refDraft(`draft.expansion.picks[${i}]`, pk.team));
  }

  const nTeams = teams.length;
  const nRows = confKeys.reduce((a, c) => a + ((st[c] || []).length), 0);
  if (nTeams !== nRows) warn(file, `クラブ数(${nTeams})と順位表の行数(${nRows})が一致しません`);
  console.log(`  クラブ ${nTeams} / 順位表 ${nRows}行 / 表彰 ${(aw.voting || []).length}部門 / ドラフト ${((dr && dr.picks) || []).length}件`);
}

console.log(`\n${errors ? "NG" : "OK"} : エラー ${errors} 件 / 警告 ${warns} 件`);
process.exit(errors ? 1 : 0);
