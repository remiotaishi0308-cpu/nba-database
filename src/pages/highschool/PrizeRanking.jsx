import { useState } from "react";
import {
  getPrizeRanking,
  getPrizeRankingYears,
  getSchoolById,
} from "../../lib/dataService";
import { ComingSoon, SectionCard } from "../../components/Placeholder";

export default function PrizeRanking() {
  const years = getPrizeRankingYears();
  const [year, setYear] = useState(years[0]);
  const rows = getPrizeRanking(year);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 bg-jbu-surface border border-jbu-border rounded-lg p-3">
        <div className="text-xs text-jbu-muted">
          高校別 賞金ポイント（単位: 万pt）
        </div>
        <div className="flex flex-wrap gap-1">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-3 py-1 rounded-md text-xs font-bold tabular-nums ${
                year === y
                  ? "bg-jbu-accent text-jbu-bg"
                  : "bg-jbu-bg border border-jbu-border text-jbu-muted hover:text-jbu-text"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <ComingSoon year={year} label="賞金ランキング" />
      ) : (
        <SectionCard kicker={`${year} PRIZE RANKING`} title={`${year}年度 賞金ランキング`}>
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-widest text-jbu-muted">
              <tr>
                <th className="text-left py-2 w-12">#</th>
                <th className="text-left py-2">高校</th>
                <th className="text-left py-2 hidden sm:table-cell">都道府県</th>
                <th className="text-right py-2">G1</th>
                <th className="text-right py-2">G2</th>
                <th className="text-right py-2">G3</th>
                <th className="text-right py-2 font-bold text-jbu-accent">合計</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const s = getSchoolById(r.schoolId);
                return (
                  <tr key={r.schoolId} className="border-t border-jbu-border hover:bg-jbu-surface-2/50">
                    <td className="py-2 font-display text-jbu-accent tabular-nums">{r.rank}</td>
                    <td className="py-2 font-bold">
                      <span className="inline-block w-1 h-4 rounded-sm align-middle mr-2" style={{ background: s?.color }} />
                      {s?.name}
                    </td>
                    <td className="py-2 text-jbu-muted hidden sm:table-cell">{s?.prefecture}</td>
                    <td className="py-2 text-right tabular-nums">{r.g1.toLocaleString()}</td>
                    <td className="py-2 text-right tabular-nums">{r.g2.toLocaleString()}</td>
                    <td className="py-2 text-right tabular-nums">{r.g3.toLocaleString()}</td>
                    <td className="py-2 text-right tabular-nums font-bold text-jbu-accent">{r.total.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SectionCard>
      )}
    </div>
  );
}
