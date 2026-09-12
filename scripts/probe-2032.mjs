import fs from "node:fs";
const s = JSON.parse(fs.readFileSync("src/data/standings.json", "utf8"));
const y = s.find((e) => e.year === 2032);
for (const lg of ["セ・リーグ", "パ・リーグ"]) {
  console.log("--- 2032", lg, "---");
  for (const r of y.leagues[lg]) {
    console.log(
      `  rank=${r.rank}  team="${r.team}"  ${r.wins}W-${r.losses}L-${r.ties ?? 0}T  GB=${r.gamesBehind}  comment="${(r.comment || "").slice(0, 40)}"`
    );
  }
}
