// 記事(src/content/articles)が参照する画像が public/ 配下に実在するか検査。
// CMS アップロード先 /images/articles/ と旧 /images/ の両方に対応（パスをそのまま
// public/ 配下として解決する）。
import { readdirSync, readFileSync, existsSync } from "node:fs";

const dir = "src/content/articles";
let ng = 0;

for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  const a = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
  const refs = [];
  if (a.thumbnailUrl) refs.push(a.thumbnailUrl);
  for (const m of a.content?.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g) ?? []) {
    refs.push(m[1]);
  }
  const bad = refs.filter(
    (r) => r.startsWith("/") && !existsSync("public" + r)
  );
  if (bad.length) {
    ng += bad.length;
    console.log(`## ${f}`);
    bad.forEach((r) => console.log(`   NG ${r}`));
  }
}
console.log(ng ? `\n${ng} 件の壊れた画像参照。` : "全記事の画像参照OK。");
