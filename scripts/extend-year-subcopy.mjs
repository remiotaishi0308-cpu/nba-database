// Add `subCopy` to every year in standings.json. Idempotent — existing
// non-empty subCopy values are preserved.
import fs from "node:fs";
import path from "node:path";

const FILE = path.resolve("src/data/standings.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

// Preview seed so the styling is visible on the default landing page.
// Replace with the editorial copy you want per year.
const SEEDS = {
  2039: "広島が驚異のリーグ5連覇!",
};

for (const entry of data) {
  if (!entry || typeof entry !== "object") continue;
  if (entry.subCopy == null) {
    entry.subCopy = SEEDS[entry.year] ?? "";
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

console.log("standings.json years with subCopy:");
for (const e of data) {
  console.log(`  ${e.year}  subCopy="${e.subCopy}"`);
}
