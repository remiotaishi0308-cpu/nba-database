import { useState } from "react";
import { getAllTimeRecords, getTeamById } from "../../lib/dataService";
import { SectionCard } from "../../components/Placeholder";
import TeamBadge from "../../components/TeamBadge";

const SUB_TABS = [
  { key: "perfect", label: "完全試合" },
  { key: "nohit", label: "ノーヒットノーラン" },
  { key: "careerHR", label: "通算本塁打" },
  { key: "careerWins", label: "通算勝利" },
  { key: "careerHits", label: "通算安打" },
  { key: "milestones", label: "主要マイルストーン" },
];

function TeamTag({ teamId }) {
  const t = getTeamById(teamId);
  if (!t) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <TeamBadge team={t} size="sm" />
      <span className="text-jbu-text text-xs">{t.shortName}</span>
    </span>
  );
}

function PerfectList({ items, label }) {
  return (
    <table className="w-full text-sm">
      <thead className="text-[10px] tracking-widest text-jbu-muted">
        <tr>
          <th className="text-left py-2 w-28">日付</th>
          <th className="text-left py-2">投手</th>
          <th className="text-left py-2">球団</th>
          <th className="text-left py-2">対戦</th>
          <th className="text-right py-2">スコア</th>
          <th className="text-right py-2">K</th>
          <th className="text-left py-2 hidden sm:table-cell">備考</th>
        </tr>
      </thead>
      <tbody>
        {items.map((r, i) => (
          <tr key={i} className="border-t border-jbu-border">
            <td className="py-2 text-jbu-muted tabular-nums">{r.date}</td>
            <td className="py-2 font-medium">{r.pitcher}</td>
            <td className="py-2"><TeamTag teamId={r.teamId} /></td>
            <td className="py-2">{r.opponent}</td>
            <td className="py-2 text-right tabular-nums">{r.score}</td>
            <td className="py-2 text-right tabular-nums">{r.ks}</td>
            <td className="py-2 text-jbu-muted hidden sm:table-cell">{r.note ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RankList({ items, valueLabel }) {
  return (
    <table className="w-full text-sm">
      <thead className="text-[10px] tracking-widest text-jbu-muted">
        <tr>
          <th className="text-left py-2 w-12">#</th>
          <th className="text-left py-2">選手</th>
          <th className="text-left py-2">球団</th>
          <th className="text-right py-2">{valueLabel}</th>
          <th className="text-right py-2 hidden sm:table-cell">現役</th>
        </tr>
      </thead>
      <tbody>
        {items.map((r) => (
          <tr key={r.rank} className="border-t border-jbu-border">
            <td className="py-2 font-display tabular-nums text-jbu-accent">{r.rank}</td>
            <td className="py-2 font-bold">{r.name}</td>
            <td className="py-2"><TeamTag teamId={r.teamId} /></td>
            <td className="py-2 text-right tabular-nums font-bold">{r.value.toLocaleString()}</td>
            <td className="py-2 text-right text-xs hidden sm:table-cell">
              {r.active ? <span className="text-emerald-400">現役</span> : <span className="text-jbu-muted">引退</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AllTimeRecords() {
  const r = getAllTimeRecords();
  const [tab, setTab] = useState("perfect");

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10px] tracking-[0.4em] text-jbu-accent">JBU ALL-TIME</div>
        <h1 className="font-display text-3xl md:text-4xl mt-1 leading-none">歴代記録</h1>
        <p className="text-xs text-jbu-muted mt-2">年度に縛られないJBUの歴史的記録。完全試合・通算記録など。</p>
      </div>

      <div className="border-b border-jbu-border overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {SUB_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
                tab === t.key ? "text-jbu-accent" : "text-jbu-muted hover:text-jbu-text"
              }`}
            >
              {t.label}
              {tab === t.key && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-jbu-accent" />
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === "perfect" && (
        <SectionCard kicker="PERFECT GAMES" title="完全試合達成者">
          <PerfectList items={r.perfectGames} />
        </SectionCard>
      )}
      {tab === "nohit" && (
        <SectionCard kicker="NO-HITTERS" title="ノーヒットノーラン達成者">
          <PerfectList items={r.noHitNoRun} />
        </SectionCard>
      )}
      {tab === "careerHR" && (
        <SectionCard kicker="HOME RUNS" title="通算本塁打ランキング">
          <RankList items={r.careerHR} valueLabel="本塁打" />
        </SectionCard>
      )}
      {tab === "careerWins" && (
        <SectionCard kicker="WINS" title="通算勝利ランキング">
          <RankList items={r.careerWins} valueLabel="勝利" />
        </SectionCard>
      )}
      {tab === "careerHits" && (
        <SectionCard kicker="HITS" title="通算安打ランキング">
          <RankList items={r.careerHits} valueLabel="安打" />
        </SectionCard>
      )}
      {tab === "milestones" && (
        <SectionCard kicker="MILESTONES" title="記録達成イベント">
          <ul className="divide-y divide-jbu-border">
            {r.milestones.map((m, i) => (
              <li key={i} className="py-2.5 flex gap-3 items-start">
                <span className="text-[10px] tracking-widest text-jbu-muted w-24 pt-0.5">{m.date}</span>
                <span className="text-sm">{m.event}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
