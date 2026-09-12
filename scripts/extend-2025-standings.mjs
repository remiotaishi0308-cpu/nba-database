// Add advanced team metrics to each 2025 row of standings.json.
// - winPercentage: derived from wins / (wins + losses)
// - everything else: initialized to 0 (filled in later when real data is known)
import fs from "node:fs";
import path from "node:path";

const FILE = path.resolve("src/data/standings.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

// Ordered exactly as the user requested in the spec.
const NEW_FIELD_ORDER = [
  "winPercentage",
  "runsScored",
  "runsAllowed",
  "teamAvg",
  "teamEra",
  "strikeouts",
  "hits",
  "homeRuns",
  "ops",
];

function round3(x) {
  return Math.round(x * 1000) / 1000;
}

const target = data.find((e) => e.year === 2025);
if (!target) throw new Error("2025 entry missing");

for (const league of ["セ・リーグ", "パ・リーグ"]) {
  const rows = target.leagues?.[league] ?? [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const decided = (r.wins ?? 0) + (r.losses ?? 0);
    const computed = {
      winPercentage: decided > 0 ? round3(r.wins / decided) : 0,
      runsScored:    r.runsScored    ?? 0,
      runsAllowed:   r.runsAllowed   ?? 0,
      teamAvg:       r.teamAvg       ?? 0,
      teamEra:       r.teamEra       ?? 0,
      strikeouts:    r.strikeouts    ?? 0,
      hits:          r.hits          ?? 0,
      homeRuns:      r.homeRuns      ?? 0,
      ops:           r.ops           ?? 0,
    };
    // Rebuild the row so existing keys come first, new keys come in spec order
    const next = { ...r };
    for (const k of NEW_FIELD_ORDER) delete next[k];
    rows[i] = { ...next, ...computed };
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

console.log("2025 row count: セ=" +
  target.leagues["セ・リーグ"].length + " パ=" +
  target.leagues["パ・リーグ"].length);
console.log("\nsample row (セ 1位):");
console.log(JSON.stringify(target.leagues["セ・リーグ"][0], null, 2));
