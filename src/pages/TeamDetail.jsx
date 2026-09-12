import { Link, useParams } from "react-router-dom";
import {
  getTeamById,
  getStandings,
  getPlayers,
  getDrafts,
  getTeamPlayerStats,
  CURRENT_YEAR,
} from "../lib/dataService";
import TeamBadge from "../components/TeamBadge";
import { SectionCard } from "../components/Placeholder";

export default function TeamDetail() {
  const { id } = useParams();
  const team = getTeamById(id);

  if (!team) {
    return (
      <div className="text-center py-20">
        <div className="text-[10px] tracking-[0.3em] text-jbu-muted">NOT FOUND</div>
        <div className="mt-3 text-xl font-bold">球団が見つかりません</div>
        <Link to="/teams" className="inline-block mt-4 text-jbu-accent text-sm">
          ← チーム一覧へ戻る
        </Link>
      </div>
    );
  }

  const standings = getStandings();
  const standing = standings
    ? [...standings.central, ...standings.pacific].find((s) => s.teamId === id)
    : null;

  const roster = getPlayers().filter((p) => p.teamId === id);
  const yearStats = getTeamPlayerStats(CURRENT_YEAR, id);
  const draftHistory = getDrafts()
    .map((d) => {
      const picks = d.teams?.[team.name] ?? [];
      const highlight = d.highlights?.find((h) => h.team === team.name);
      return picks.length || highlight
        ? { year: d.year, picks, highlight }
        : null;
    })
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="text-xs">
        <Link to="/teams" className="text-jbu-muted hover:text-jbu-accent">
          チーム一覧
        </Link>
        <span className="text-jbu-muted mx-2">/</span>
        <span className="text-jbu-text">{team.name}</span>
      </div>

      {/* HERO */}
      <section
        className="relative overflow-hidden rounded-xl border border-jbu-border"
        style={{
          background: `linear-gradient(135deg, ${team.primaryColor}22 0%, var(--color-jbu-surface) 60%)`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: team.primaryColor }}
        />
        <div className="relative px-6 py-7 md:px-10 md:py-9 flex flex-col md:flex-row md:items-center gap-5">
          <TeamBadge team={team} size="xl" />
          <div className="flex-1">
            <div className="text-[10px] tracking-[0.3em] text-jbu-accent">
              {team.leagueLabel ?? team.league}
            </div>
            <h1 className="font-display text-3xl md:text-5xl mt-1 leading-none">
              {team.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-jbu-muted">
              <span>本拠地: <span className="text-jbu-text">{team.stadium}</span></span>
              <span>都市: <span className="text-jbu-text">{team.city}</span></span>
              <span>創設: <span className="text-jbu-text">{team.founded}</span></span>
              <span>監督: <span className="text-jbu-text">{team.manager}</span></span>
            </div>
          </div>
          <div className="flex gap-3 md:flex-col md:items-end text-center md:text-right">
            <div>
              <div className="text-[10px] tracking-widest text-jbu-muted">優勝</div>
              <div className="font-display text-3xl mt-1 leading-none">
                {team.championships}
              </div>
              <div className="text-[10px] text-jbu-muted mt-1">回</div>
            </div>
            {standing && (
              <div>
                <div className="text-[10px] tracking-widest text-jbu-muted">2039 順位</div>
                <div className="font-display text-3xl mt-1 leading-none">
                  {standing.rank}<span className="text-base">位</span>
                </div>
                <div className="text-[10px] text-jbu-muted mt-1">
                  {standing.wins}勝{standing.losses}敗
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PROFILE STRIP */}
      <section className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Stat kicker="LOGO" value={team.logo} />
        <Stat kicker="COLOR" value={team.color} />
        <Stat kicker="LEAGUE" value={team.leagueLabel ?? team.league} />
        <Stat kicker="FOUNDED" value={team.founded} />
        <Stat kicker="STADIUM" value={team.stadium} small />
      </section>

      {/* ROSTER */}
      {roster.length > 0 && (
        <SectionCard kicker="KEY ROSTER" title="主力選手">
          <table className="w-full text-sm">
            <thead className="text-[10px] tracking-widest text-jbu-muted">
              <tr>
                <th className="text-left py-2">選手</th>
                <th className="text-left py-2">守備</th>
                <th className="text-right py-2">背番号</th>
                <th className="text-left py-2 hidden md:table-cell">獲得タイトル</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((p) => (
                <tr key={p.id} className="border-t border-jbu-border">
                  <td className="py-2 font-medium">{p.name}</td>
                  <td className="py-2 text-jbu-muted">{p.position}</td>
                  <td className="py-2 text-right tabular-nums">{p.uniformNumber}</td>
                  <td className="py-2 text-xs text-jbu-muted hidden md:table-cell">
                    {p.awards?.slice(0, 2).join(" / ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      {/* 2039 STATS */}
      {yearStats && (
        <div className="grid lg:grid-cols-2 gap-4">
          <SectionCard kicker="2039 BATTERS" title="打撃成績">
            <table className="w-full text-sm">
              <thead className="text-[10px] tracking-widest text-jbu-muted">
                <tr>
                  <th className="text-left py-2">選手</th>
                  <th className="text-right py-2">打率</th>
                  <th className="text-right py-2">本</th>
                  <th className="text-right py-2">点</th>
                </tr>
              </thead>
              <tbody>
                {yearStats.batters.map((b) => (
                  <tr key={b.name} className="border-t border-jbu-border">
                    <td className="py-2">{b.name}</td>
                    <td className="py-2 text-right tabular-nums">{b.avg.toFixed(3)}</td>
                    <td className="py-2 text-right tabular-nums">{b.hr}</td>
                    <td className="py-2 text-right tabular-nums">{b.rbi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
          <SectionCard kicker="2039 PITCHERS" title="投手成績">
            <table className="w-full text-sm">
              <thead className="text-[10px] tracking-widest text-jbu-muted">
                <tr>
                  <th className="text-left py-2">選手</th>
                  <th className="text-right py-2">勝</th>
                  <th className="text-right py-2">負</th>
                  <th className="text-right py-2">防御率</th>
                </tr>
              </thead>
              <tbody>
                {yearStats.pitchers.map((p) => (
                  <tr key={p.name} className="border-t border-jbu-border">
                    <td className="py-2">{p.name}</td>
                    <td className="py-2 text-right tabular-nums">{p.w}</td>
                    <td className="py-2 text-right tabular-nums">{p.l}</td>
                    <td className="py-2 text-right tabular-nums">{p.era.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </div>
      )}

      {/* DRAFT HISTORY */}
      {draftHistory.length > 0 && (
        <SectionCard kicker="DRAFT HISTORY" title="ドラフト指名履歴">
          <ul className="divide-y divide-jbu-border">
            {draftHistory.map((d) => (
              <li key={d.year} className="py-3 flex items-start gap-4">
                <span className="font-display text-jbu-accent tabular-nums w-16 pt-0.5">
                  {d.year}
                </span>
                <div className="flex-1 space-y-2">
                  {d.highlight && (
                    <div className="text-sm">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-jbu-accent/15 text-jbu-accent mr-2">
                        注目
                      </span>
                      <span className="font-bold">{d.highlight.player}</span>
                      <span className="text-xs text-jbu-muted ml-2">
                        {d.highlight.pos} / {d.highlight.type}
                      </span>
                      <p className="text-xs text-jbu-muted mt-0.5">{d.highlight.text}</p>
                    </div>
                  )}
                  {d.picks.length > 0 && (
                    <div className="text-xs text-jbu-muted">
                      指名:{" "}
                      {d.picks
                        .map((p) =>
                          typeof p === "string"
                            ? p
                            : `${p?.round ?? "?"}巡 ${p?.name ?? "—"}`
                        )
                        .join("、")}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}

function Stat({ kicker, value, small }) {
  return (
    <div className="bg-jbu-surface border border-jbu-border rounded-lg px-4 py-3">
      <div className="text-[10px] tracking-widest text-jbu-muted">{kicker}</div>
      <div className={`mt-1 font-bold ${small ? "text-sm" : "text-lg"}`}>{value}</div>
    </div>
  );
}
