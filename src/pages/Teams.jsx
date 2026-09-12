import { useState } from "react";
import { Link } from "react-router-dom";
import { getTeams, getStandings } from "../lib/dataService";
import SectionTitle from "../components/SectionTitle";
import TeamBadge from "../components/TeamBadge";

export default function Teams() {
  const [league, setLeague] = useState("all");
  const teams = getTeams();
  const standings = getStandings();
  const standingMap = standings
    ? Object.fromEntries(
        [...standings.central, ...standings.pacific].map((s) => [s.teamId, s])
      )
    : {};

  const filtered = teams.filter((t) =>
    league === "all" ? true : t.league === league
  );

  return (
    <div className="space-y-5">
      <SectionTitle
        kicker="TEAMS"
        title="JBU 全16球団"
        action={
          <div className="flex gap-1 bg-jbu-surface border border-jbu-border rounded-md p-1 text-xs">
            {[
              { v: "all", l: "全て" },
              { v: "central", l: "セ" },
              { v: "pacific", l: "パ" },
            ].map((opt) => (
              <button
                key={opt.v}
                onClick={() => setLeague(opt.v)}
                className={`px-3 py-1 rounded-sm transition-colors ${
                  league === opt.v
                    ? "bg-jbu-accent text-jbu-bg font-bold"
                    : "text-jbu-muted hover:text-jbu-text"
                }`}
              >
                {opt.l}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filtered.map((t) => {
          const s = standingMap[t.id];
          return (
            <Link
              key={t.id}
              to={`/teams/${t.id}`}
              className="group relative bg-jbu-surface border border-jbu-border rounded-lg p-4 hover:border-jbu-accent/60 transition-colors block"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                style={{ background: t.primaryColor }}
              />
              <div className="flex items-start gap-3 mt-1">
                <TeamBadge team={t} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] tracking-widest text-jbu-muted">
                    {t.leagueLabel ?? (t.league === "central" ? "セ・リーグ" : "パ・リーグ")}
                  </div>
                  <div className="text-base font-bold mt-0.5 leading-tight truncate">
                    {t.name}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-jbu-muted space-y-0.5">
                <div>{t.stadium}</div>
                <div>監督: {t.manager}</div>
              </div>

              {s && (
                <div className="mt-3 pt-3 border-t border-jbu-border flex justify-between text-xs">
                  <span className="text-jbu-muted">2039 順位</span>
                  <span className="font-bold tabular-nums">
                    {s.rank}位 ({s.wins}-{s.losses})
                  </span>
                </div>
              )}
              <div className="mt-2 text-[10px] text-jbu-accent opacity-0 group-hover:opacity-100 transition-opacity">
                詳細を見る →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
