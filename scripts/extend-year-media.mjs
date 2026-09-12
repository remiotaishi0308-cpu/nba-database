// Add heroImageUrl / summaryImageUrl to every year in standings.json.
// Idempotent — if a year already has these fields, the existing value wins.
import fs from "node:fs";
import path from "node:path";

const FILE = path.resolve("src/data/standings.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

const HERO_PLACEHOLDER = "https://placehold.jp/222/eeeeee/1600x520.png?text=JBU+SEASON";
const SUMMARY_PLACEHOLDER = "https://placehold.jp/222/eeeeee/1200x600.png?text=SEASON+RECAP";

for (const entry of data) {
  if (!entry || typeof entry !== "object") continue;
  if (entry.heroImageUrl == null) {
    entry.heroImageUrl = `${HERO_PLACEHOLDER}+${entry.year}`;
  }
  if (entry.summaryImageUrl == null) {
    entry.summaryImageUrl = `${SUMMARY_PLACEHOLDER}+${entry.year}`;
  }
}

fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");

console.log("standings.json years extended:", data.map((e) => e.year));
console.log("sample 2025:", JSON.stringify({
  year: data[0].year,
  heroImageUrl: data[0].heroImageUrl,
  summaryImageUrl: data[0].summaryImageUrl,
}, null, 2));
