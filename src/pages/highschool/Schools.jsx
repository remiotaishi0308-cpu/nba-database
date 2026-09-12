import { useMemo, useState } from "react";
import { getSchools } from "../../lib/dataService";

export default function Schools() {
  const schools = getSchools();
  const [q, setQ] = useState("");
  const [pref, setPref] = useState("ALL");
  const [category, setCategory] = useState("ALL");

  const prefectures = useMemo(
    () => Array.from(new Set(schools.map((s) => s.prefecture))).sort(),
    [schools]
  );

  const filtered = schools.filter((s) => {
    if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (pref !== "ALL" && s.prefecture !== pref) return false;
    if (category !== "ALL" && s.category !== category) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 bg-jbu-surface border border-jbu-border rounded-lg p-3">
        <div className="flex-1 min-w-[180px]">
          <div className="text-[10px] tracking-widest text-jbu-muted mb-1">校名検索</div>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="校名で検索"
            className="w-full bg-jbu-bg border border-jbu-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-jbu-accent"
          />
        </div>
        <div>
          <div className="text-[10px] tracking-widest text-jbu-muted mb-1">都道府県</div>
          <select
            value={pref}
            onChange={(e) => setPref(e.target.value)}
            className="bg-jbu-bg border border-jbu-border rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-jbu-accent"
          >
            <option value="ALL">全て</option>
            {prefectures.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <div className="text-[10px] tracking-widest text-jbu-muted mb-1">区分</div>
          <div className="flex gap-1 bg-jbu-bg border border-jbu-border rounded-md p-1 text-xs">
            {["ALL", "私立", "県立"].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-sm font-bold ${
                  category === c ? "bg-jbu-accent text-jbu-bg" : "text-jbu-muted hover:text-jbu-text"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="ml-auto text-xs text-jbu-muted">
          {filtered.length} / {schools.length} 校
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((s) => (
          <article
            key={s.id}
            className="relative bg-jbu-surface border border-jbu-border rounded-lg p-4 hover:border-jbu-accent/50 transition-colors"
          >
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: s.color }} />
            <div className="flex items-start justify-between mt-1">
              <div>
                <div className="text-[10px] tracking-widest text-jbu-muted">{s.prefecture} ／ {s.category}</div>
                <h3 className="text-base font-bold mt-0.5 leading-tight">{s.name}</h3>
              </div>
              <div className="text-[10px] text-jbu-muted">創立 {s.founded}</div>
            </div>
            <div className="mt-3 flex gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-jbu-accent/15 text-jbu-accent font-bold">G1 {s.championships.g1}</span>
              <span className="px-2 py-0.5 rounded bg-jbu-surface-2 text-jbu-text">G2 {s.championships.g2}</span>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <div className="lg:col-span-3 text-center py-10 text-jbu-muted text-sm">
            条件に該当する学校が見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
}
