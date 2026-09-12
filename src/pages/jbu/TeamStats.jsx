import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getTeams, getTeamPlayerStats, getPersonalStats } from "../../lib/dataService";
import { ComingSoon, SectionCard } from "../../components/Placeholder";
import TeamBadge from "../../components/TeamBadge";

export default function TeamStats() {
  const { year } = useOutletContext();
  const teams = getTeams();
  const [teamId, setTeamId] = useState(teams[0].id);
  const yearStats = getTeamPlayerStats(year);
  const stats = yearStats?.[teamId];
  const team = teams.find((t) => t.id === teamId);
  const personalStats = getPersonalStats(year, teamId);

  return (
    <div className="space-y-4">
      <SectionCard kicker="TEAM SELECT" title="球団選択">
        <div className="flex flex-wrap gap-2">
          {teams.map((t) => (
            <button
              key={t.id}
              onClick={() => setTeamId(t.id)}
              className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-md text-xs border transition-colors ${
                teamId === t.id
                  ? "border-jbu-accent text-jbu-accent bg-jbu-accent/10"
                  : "border-jbu-border text-jbu-muted hover:text-jbu-text"
              }`}
            >
              <TeamBadge team={t} size="sm" />
              <span>{t.shortName}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      {personalStats && personalStats.length > 0 && (
        <SectionCard kicker="PERSONAL STATS" title={`${team?.name} 注目選手`}>
          <div className="space-y-4">
            {personalStats.map((stat, i) => (
              <div
                key={i}
                className="pb-4 border-b border-jbu-border last:pb-0 last:border-0"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{stat.player}</span>
                    <span className="text-[10px] text-jbu-muted bg-jbu-surface px-2 py-1 rounded">
                      {stat.position}
                    </span>
                  </div>
                </div>
                {stat.record && (
                  <div className="text-sm text-jbu-muted mb-2">{stat.record}</div>
                )}
                {stat.comment && (
                  <div className="text-sm leading-relaxed text-jbu-text">
                    {stat.comment}
                  </div>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {!stats ? (
        <ComingSoon year={year} label={`${team?.name} の個人成績`} />
      ) : (
        <>
          <SectionCard kicker="BATTERS" title={`${team?.name} 打撃成績`}>
            <table className="w-full text-sm">
              <thead className="text-[10px] tracking-widest text-jbu-muted">
                <tr>
                  <th className="text-left py-2">選手</th>
                  <th className="text-left py-2">守</th>
                  <th className="text-right py-2">試合</th>
                  <th className="text-right py-2">打率</th>
                  <th className="text-right py-2">本</th>
                  <th className="text-right py-2">点</th>
                  <th className="text-right py-2">盗</th>
                  <th className="text-right py-2">OPS</th>
                </tr>
              </thead>
              <tbody>
                {stats.batters.map((b) => (
                  <tr key={b.name} className="border-t border-jbu-border">
                    <td className="py-2 font-medium">{b.name}</td>
                    <td className="py-2 text-jbu-muted">{b.pos}</td>
                    <td className="py-2 text-right tabular-nums">{b.g}</td>
                    <td className="py-2 text-right tabular-nums">{b.avg.toFixed(3)}</td>
                    <td className="py-2 text-right tabular-nums">{b.hr}</td>
                    <td className="py-2 text-right tabular-nums">{b.rbi}</td>
                    <td className="py-2 text-right tabular-nums">{b.sb}</td>
                    <td className="py-2 text-right tabular-nums">{b.ops.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <SectionCard kicker="PITCHERS" title={`${team?.name} 投手成績`}>
            <table className="w-full text-sm">
              <thead className="text-[10px] tracking-widest text-jbu-muted">
                <tr>
                  <th className="text-left py-2">選手</th>
                  <th className="text-right py-2">登板</th>
                  <th className="text-right py-2">勝</th>
                  <th className="text-right py-2">負</th>
                  <th className="text-right py-2">防御率</th>
                  <th className="text-right py-2">奪三振</th>
                  <th className="text-right py-2">回</th>
                </tr>
              </thead>
              <tbody>
                {stats.pitchers.map((p) => (
                  <tr key={p.name} className="border-t border-jbu-border">
                    <td className="py-2 font-medium">{p.name}</td>
                    <td className="py-2 text-right tabular-nums">{p.g}</td>
                    <td className="py-2 text-right tabular-nums">{p.w}</td>
                    <td className="py-2 text-right tabular-nums">{p.l}</td>
                    <td className="py-2 text-right tabular-nums">{p.era.toFixed(2)}</td>
                    <td className="py-2 text-right tabular-nums">{p.so}</td>
                    <td className="py-2 text-right tabular-nums">{p.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </>
      )}
    </div>
  );
}
