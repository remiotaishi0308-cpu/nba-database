import { useOutletContext } from "react-router-dom";
import { getDraftByYear, getTeamByName } from "../../lib/dataService";
import { ComingSoon, SectionCard } from "../../components/Placeholder";
import TeamBadge from "../../components/TeamBadge";

export default function Draft() {
  const { year } = useOutletContext();
  const draft = getDraftByYear(year);
  if (!draft) return <ComingSoon year={year} label="ドラフト" />;

  const totalPicks = Object.values(draft.teams ?? {}).reduce(
    (sum, picks) => sum + (picks?.length ?? 0),
    0
  );

  return (
    <div className="space-y-4">
      <SectionCard kicker={`${draft.year} DRAFT`} title={`${draft.year}年 ドラフト会議`}>
        <p className="text-sm text-jbu-muted">
          注目選手 {draft.highlights?.length ?? 0} 名・全 {totalPicks} 名が指名された
        </p>
      </SectionCard>

      {draft.highlights?.length > 0 && (
        <SectionCard kicker="HIGHLIGHTS" title="注目指名">
          <ul className="space-y-3">
            {draft.highlights.map((h, i) => {
              const team = getTeamByName(h.team);
              return (
                <li
                  key={i}
                  className="flex items-start gap-3 border-l-2 border-jbu-accent/60 pl-3 py-1"
                >
                  <TeamBadge team={team} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{h.player}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-jbu-surface-2 text-jbu-muted">
                        {h.pos}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-jbu-accent/15 text-jbu-accent">
                        {h.type}
                      </span>
                      <span className="text-xs text-jbu-muted">
                        → {team?.shortName ?? h.team}
                      </span>
                    </div>
                    <p className="text-xs text-jbu-muted mt-1">{h.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}

      <SectionCard kicker="TEAM PICKS" title="球団別 指名選手一覧">
        <div className="grid md:grid-cols-2 gap-3">
          {Object.entries(draft.teams ?? {}).map(([teamName, picks]) => {
            const team = getTeamByName(teamName);
            const safePicks = Array.isArray(picks) ? picks : [];
            return (
              <div
                key={teamName}
                className="bg-jbu-surface-2/60 border border-jbu-border rounded-md p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TeamBadge team={team} size="sm" />
                  <span className="font-bold text-sm">
                    {team?.shortName ?? teamName}
                  </span>
                  <span className="text-[10px] text-jbu-muted ml-auto">
                    {safePicks.length} 名
                  </span>
                </div>
                <ol className="space-y-0.5">
                  {safePicks.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-baseline gap-2 text-xs py-0.5"
                    >
                      <span className="text-jbu-accent tabular-nums w-8 text-right shrink-0">
                        {p?.round ? `${p.round}巡` : `${i + 1}.`}
                      </span>
                      <span className="font-medium text-jbu-text">
                        {p?.name ?? "—"}
                      </span>
                      {p?.position && (
                        <span className="text-[10px] text-jbu-muted">
                          {p.position}
                        </span>
                      )}
                      {p?.type && (
                        <span className="text-[10px] px-1 rounded-sm bg-jbu-surface text-jbu-muted ml-auto">
                          {p.type}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
