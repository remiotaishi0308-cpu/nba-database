// One-shot migration: move 月間MVP / ベストナイン / ゴールデングラブ rows out of
// titles.json[2029] into monthlyMvp.json and awards.json. Idempotent — re-runs
// re-derive from the source-of-truth titles.json and re-replace the 2029 entry
// in the other two files.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/data");
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
const write = (f, v) =>
  fs.writeFileSync(path.join(ROOT, f), JSON.stringify(v, null, 2) + "\n", "utf8");

const titles = read("titles.json");
const monthly = read("monthlyMvp.json");
const awards = read("awards.json");

// --- parse misplaced rows out of titles.json --------------------------------

const RE_MONTH = /^月間MVP\((\d月)・(投手|野手)\)$/;
const RE_BN = /^ベストナイン\((.+)\)$/;
const RE_GG = /^ゴールデングラブ\((.+)\)$/;

const POS_HITTER = "野手"; // titles.json wording
const PITCHER_KEY = "投手";
const HITTER_KEY = "打者"; // monthlyMvp.json wording

function partitionYear(yearEntry) {
  const out = { titles: { year: yearEntry.year, leagues: {} },
                monthly: { year: yearEntry.year, leagues: {} },
                awards:  { year: yearEntry.year, leagues: {} } };
  for (const [league, rows] of Object.entries(yearEntry.leagues)) {
    const main = [];
    const mvpP = [], mvpH = [];
    const bn = [], gg = [];
    for (const r of rows) {
      let m;
      if ((m = r.title.match(RE_MONTH))) {
        const [, month, role] = m;
        const item = { month, player: r.player, team: r.team };
        if (r.note) item.note = r.note;
        (role === POS_HITTER ? mvpH : mvpP).push(item);
      } else if ((m = r.title.match(RE_BN))) {
        bn.push({ position: m[1], player: r.player, team: r.team });
      } else if ((m = r.title.match(RE_GG))) {
        gg.push({ position: m[1], player: r.player, team: r.team });
      } else {
        main.push(r);
      }
    }
    out.titles.leagues[league] = main;
    if (mvpP.length || mvpH.length) {
      out.monthly.leagues[league] = { [PITCHER_KEY]: mvpP, [HITTER_KEY]: mvpH };
    }
    if (bn.length || gg.length) {
      out.awards.leagues[league] = {};
      if (bn.length) out.awards.leagues[league]["ベストナイン"] = bn;
      if (gg.length) out.awards.leagues[league]["ゴールデングラブ"] = gg;
    }
  }
  return out;
}

// --- rebuild titles.json (strip misplaced rows from every year) -------------

const cleanedTitles = [];
const derivedMonthly = []; // by year
const derivedAwards = [];  // by year

for (const y of titles) {
  const p = partitionYear(y);
  cleanedTitles.push(p.titles);
  if (Object.keys(p.monthly.leagues).length) derivedMonthly.push(p.monthly);
  if (Object.keys(p.awards.leagues).length) derivedAwards.push(p.awards);
}

// --- merge derived data into monthlyMvp.json / awards.json ------------------

function upsertByYear(list, entry) {
  const i = list.findIndex((e) => e.year === entry.year);
  if (i >= 0) list[i] = entry;
  else list.push(entry);
}

for (const e of derivedMonthly) upsertByYear(monthly, e);
for (const e of derivedAwards)  upsertByYear(awards, e);

monthly.sort((a, b) => a.year - b.year);
awards.sort((a, b) => a.year - b.year);

// --- write ------------------------------------------------------------------

write("titles.json", cleanedTitles);
write("monthlyMvp.json", monthly);
write("awards.json", awards);

console.log("titles.json years:", cleanedTitles.map((e) => e.year));
console.log("monthlyMvp.json years:", monthly.map((e) => e.year));
console.log("awards.json years:", awards.map((e) => e.year));
console.log("\nmigrated 2029 monthly entries:");
const m29 = monthly.find((e) => e.year === 2029);
for (const [lg, lr] of Object.entries(m29?.leagues ?? {})) {
  console.log("  ", lg, "投手:", lr["投手"]?.length, "打者:", lr["打者"]?.length);
}
console.log("\nmigrated 2029 awards entries:");
const a29 = awards.find((e) => e.year === 2029);
for (const [lg, lr] of Object.entries(a29?.leagues ?? {})) {
  console.log("  ", lg, "BN:", lr["ベストナイン"]?.length, "GG:", lr["ゴールデングラブ"]?.length);
}
