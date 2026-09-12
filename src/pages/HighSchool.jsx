import { useMemo, useState } from "react";
import { getTournaments } from "../lib/dataService";
import SectionTitle from "../components/SectionTitle";

const GRADES = ["G1", "G2", "G3"];

export default function HighSchool() {
  const tournaments = getTournaments();
  const years = useMemo(
    () => Array.from(new Set(tournaments.map((t) => t.year))).sort((a, b) => b - a),
    [tournaments]
  );

  const [grade, setGrade] = useState("ALL");
  const [year, setYear] = useState("ALL");

  const filtered = tournaments.filter(
    (t) =>
      (grade === "ALL" || t.grade === grade) &&
      (year === "ALL" || t.year === Number(year))
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="HAKKYU-NO-KISEKI"
        title="高校野球 大会データベース"
      />

      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <div className="text-[10px] tracking-widest text-jbu-muted mb-1">
            グレード
          </div>
          <div className="flex gap-1 bg-jbu-surface border border-jbu-border rounded-md p-1 text-xs">
            {["ALL", ...GRADES].map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`px-3 py-1 rounded-sm font-bold ${
                  grade === g
                    ? "bg-jbu-accent text-jbu-bg"
                    : "text-jbu-muted hover:text-jbu-text"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-widest text-jbu-muted mb-1">
            年度
          </div>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-jbu-surface border border-jbu-border rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-jbu-accent"
          >
            <option value="ALL">全年度</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-jbu-muted">
          {filtered.length} 件の大会を表示中
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <article
            key={t.id}
            className="bg-jbu-surface border border-jbu-border rounded-lg p-5 hover:border-jbu-accent/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-jbu-accent/15 text-jbu-accent tracking-wider">
                {t.grade}
              </span>
              <span className="text-[10px] tracking-widest text-jbu-muted">
                {t.year} / {t.season}
              </span>
            </div>
            <h3 className="text-lg font-bold leading-snug">{t.name}</h3>
            <div className="text-xs text-jbu-muted mt-1">
              {t.period} ／ {t.venue} ／ 出場 {t.participants} 校
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <div className="text-[10px] text-jbu-muted tracking-widest">優勝</div>
                <div className="font-medium mt-0.5 leading-tight">{t.champion}</div>
              </div>
              <div>
                <div className="text-[10px] text-jbu-muted tracking-widest">準優勝</div>
                <div className="font-medium mt-0.5 leading-tight">{t.runnerUp}</div>
              </div>
              <div>
                <div className="text-[10px] text-jbu-muted tracking-widest">MVP</div>
                <div className="font-medium mt-0.5 leading-tight">{t.mvp}</div>
              </div>
            </div>
            <p className="mt-4 text-xs text-jbu-muted border-t border-jbu-border pt-3">
              {t.headline}
            </p>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-jbu-muted text-sm">
          条件に該当する大会が見つかりませんでした。
        </div>
      )}
    </div>
  );
}
