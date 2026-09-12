import { useMemo, useState } from "react";
import { getDrafts, getTeams } from "../lib/dataService";
import SectionTitle from "../components/SectionTitle";

export default function Drafts() {
  const drafts = getDrafts();
  const teams = getTeams();
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
  const [selectedYear, setSelectedYear] = useState(drafts[0].year);
  const [query, setQuery] = useState("");

  const selected = drafts.find((d) => d.year === selectedYear);

  const filtered = useMemo(() => {
    if (!query.trim()) return selected;
    const q = query.toLowerCase();
    return {
      ...selected,
      firstRound: selected.firstRound.filter(
        (p) =>
          p.player.toLowerCase().includes(q) ||
          (teamMap[p.teamId]?.shortName || "").toLowerCase().includes(q) ||
          p.from.toLowerCase().includes(q)
      ),
    };
  }, [selected, query, teamMap]);

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="DRAFT ARCHIVE"
        title="ドラフト履歴 2025-2039"
        action={
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="選手名・球団名・出身校で検索"
            className="bg-jbu-surface border border-jbu-border rounded-md px-3 py-1.5 text-sm w-56 focus:outline-none focus:border-jbu-accent"
          />
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {drafts.map((d) => (
          <button
            key={d.year}
            onClick={() => setSelectedYear(d.year)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold tabular-nums transition-colors ${
              selectedYear === d.year
                ? "bg-jbu-accent text-jbu-bg"
                : "bg-jbu-surface text-jbu-muted border border-jbu-border hover:text-jbu-text"
            }`}
          >
            {d.year}
          </button>
        ))}
      </div>

      <div className="bg-jbu-surface border border-jbu-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-jbu-border">
          <div className="text-[10px] tracking-widest text-jbu-accent">
            {filtered.year} DRAFT
          </div>
          <div className="text-lg font-bold mt-0.5">
            {filtered.date} ／ {filtered.venue}
          </div>
          <div className="text-xs text-jbu-muted mt-1">
            総指名 {filtered.totalPicks} 名 — {filtered.headline}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-[10px] tracking-widest text-jbu-muted bg-jbu-surface-2">
            <tr>
              <th className="text-left px-4 py-2 w-12">巡目</th>
              <th className="text-left px-2 py-2">球団</th>
              <th className="text-left px-2 py-2">選手</th>
              <th className="text-left px-2 py-2">守備</th>
              <th className="text-left px-4 py-2">出身</th>
              <th className="text-left px-4 py-2 hidden sm:table-cell">区分</th>
            </tr>
          </thead>
          <tbody>
            {filtered.firstRound.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-jbu-muted text-xs">
                  該当する指名が見つかりませんでした。
                </td>
              </tr>
            ) : (
              filtered.firstRound.map((p) => {
                const t = teamMap[p.teamId];
                return (
                  <tr
                    key={`${filtered.year}-${p.pick}`}
                    className="border-t border-jbu-border hover:bg-jbu-surface-2/50"
                  >
                    <td className="px-4 py-2.5 text-jbu-muted tabular-nums">
                      {p.pick}位
                    </td>
                    <td className="px-2 py-2.5">
                      <span
                        className="inline-block w-1 h-4 rounded-sm align-middle mr-2"
                        style={{ background: t?.primaryColor }}
                      />
                      {t?.shortName}
                    </td>
                    <td className="px-2 py-2.5 font-medium">{p.player}</td>
                    <td className="px-2 py-2.5 text-jbu-muted">{p.position}</td>
                    <td className="px-4 py-2.5">{p.from}</td>
                    <td className="px-4 py-2.5 text-jbu-muted hidden sm:table-cell">
                      {p.type}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-jbu-muted">
        ※ 表示中は1巡目データ。完全アーカイブはJSON拡張で追加可能。
      </p>
    </div>
  );
}
