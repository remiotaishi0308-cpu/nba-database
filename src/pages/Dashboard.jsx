import {
  getCurrentSeason,
  getStandings,
  getTeams,
  getNews,
  getTournaments,
  getDrafts,
  getTeamByName,
  CURRENT_YEAR,
} from "../lib/dataService";
import SectionTitle from "../components/SectionTitle";
import TeamBadge from "../components/TeamBadge";

function teamLookup(teams) {
  return Object.fromEntries(teams.map((t) => [t.id, t]));
}

function MiniStanding({ league, rows, teams, year }) {
  const accent = league === "central" ? "text-central" : "text-pacific";
  const label = league === "central" ? "セ・リーグ" : "パ・リーグ";
  return (
    <div className="bg-jbu-surface border border-jbu-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-jbu-border flex items-center justify-between">
        <div>
          <div className={`text-[10px] tracking-widest ${accent}`}>
            {league === "central" ? "CENTRAL LEAGUE" : "PACIFIC LEAGUE"}
          </div>
          <div className="text-sm font-bold">{label} 順位表</div>
        </div>
        <div className="text-[10px] text-jbu-muted">{year} SEASON</div>
      </div>
      <table className="w-full text-sm">
        <thead className="text-[10px] tracking-widest text-jbu-muted bg-jbu-surface-2">
          <tr>
            <th className="text-left px-3 py-2 w-8">#</th>
            <th className="text-left px-2 py-2">チーム</th>
            <th className="text-right px-2 py-2">勝</th>
            <th className="text-right px-2 py-2">負</th>
            <th className="text-right px-2 py-2">勝率</th>
            <th className="text-right px-3 py-2 hidden sm:table-cell">差</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const team = teams[r.teamId];
            return (
              <tr
                key={`${r.rank ?? i}-${r.teamName}`}
                className="border-t border-jbu-border hover:bg-jbu-surface-2/50 transition-colors"
              >
                <td className="px-3 py-2 text-jbu-muted">{r.rank}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <TeamBadge team={team} size="sm" />
                    <span className="font-medium">{team?.shortName ?? r.teamName}</span>
                  </div>
                </td>
                <td className="px-2 py-2 text-right tabular-nums">{r.wins}</td>
                <td className="px-2 py-2 text-right tabular-nums">{r.losses}</td>
                <td className="px-2 py-2 text-right tabular-nums font-medium">
                  {r.pct.toFixed(3)}
                </td>
                <td className="px-3 py-2 text-right text-jbu-muted hidden sm:table-cell tabular-nums">
                  {r.gamesBehind === 0 ? "-" : r.gamesBehind.toFixed(1)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatBlock({ kicker, value, sub, accent = "text-jbu-accent" }) {
  return (
    <div className="bg-jbu-surface border border-jbu-border rounded-lg p-4">
      <div className={`text-[10px] tracking-widest ${accent}`}>{kicker}</div>
      <div className="mt-2 text-2xl md:text-3xl font-bold leading-none tabular-nums">
        {value}
      </div>
      {sub && <div className="mt-2 text-xs text-jbu-muted">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const season = getCurrentSeason();
  const standings = getStandings();
  const standingsYear = standings?.season ?? CURRENT_YEAR;
  const teams = teamLookup(getTeams());
  const news = getNews(5);
  const tournaments = getTournaments().slice(0, 3);
  const drafts = getDrafts();
  const latestDraft = drafts[0] ?? null;

  const cenTop = standings?.central?.[0];
  const pacTop = standings?.pacific?.[0];

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-jbu-surface to-jbu-surface-2 border border-jbu-border">
        <div className="absolute inset-0 diagonal-accent opacity-60" />
        <div className="relative px-6 py-8 md:px-10 md:py-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-[10px] tracking-[0.4em] text-jbu-accent">
              {season.phase?.toUpperCase()}
            </div>
            <h1 className="mt-2 text-4xl md:text-6xl font-bold font-display leading-none">
              {standingsYear} <span className="text-jbu-accent">SEASON</span>
            </h1>
            <p className="mt-3 text-sm text-jbu-muted max-w-lg">
              開幕 {season.startDate} / レギュラーシーズン終了予定 {season.endDate}
              <br />
              ポストシーズン開始 {season.postseasonStart}　・　ドラフト会議 {season.draftDate}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <StatBlock
              kicker="セ・首位"
              value={cenTop ? (teams[cenTop.teamId]?.shortName ?? cenTop.teamName) : "—"}
              sub={cenTop ? `${cenTop.wins}勝${cenTop.losses}敗` : "データ無し"}
              accent="text-central"
            />
            <StatBlock
              kicker="パ・首位"
              value={pacTop ? (teams[pacTop.teamId]?.shortName ?? pacTop.teamName) : "—"}
              sub={pacTop ? `${pacTop.wins}勝${pacTop.losses}敗` : "データ無し"}
              accent="text-pacific"
            />
          </div>
        </div>
      </section>

      {/* STANDINGS */}
      {standings && (
        <section>
          <SectionTitle kicker="STANDINGS" title={`${standingsYear} 順位表`} />
          <div className="grid lg:grid-cols-2 gap-4">
            <MiniStanding league="central" rows={standings.central} teams={teams} year={standingsYear} />
            <MiniStanding league="pacific" rows={standings.pacific} teams={teams} year={standingsYear} />
          </div>
        </section>
      )}

      {/* LEADERS / NEWS */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-jbu-surface border border-jbu-border rounded-lg p-5">
          <SectionTitle kicker="HEADLINES" title="サイト更新 & 注目記録" />
          <ul className="divide-y divide-jbu-border">
            {news.map((n) => (
              <li key={n.id} className="py-3 flex gap-4">
                <div className="text-[10px] tracking-widest text-jbu-muted w-20 shrink-0 pt-1">
                  {n.date}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-jbu-accent/15 text-jbu-accent tracking-wider">
                      {n.tag}
                    </span>
                    <span className="text-[10px] text-jbu-muted">{n.category}</span>
                  </div>
                  <div className="text-sm font-medium leading-snug">{n.title}</div>
                  <div className="text-xs text-jbu-muted mt-0.5 leading-relaxed">
                    {n.summary}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="bg-jbu-surface border border-jbu-border rounded-lg p-5">
            <SectionTitle kicker="LEADERS" title="セ・リーグ 主要部門" />
            <ul className="text-sm space-y-2">
              <li className="flex justify-between gap-3">
                <span className="text-jbu-muted">最多勝</span>
                <span className="font-medium text-right">{season.leagueLeaders?.central?.wins}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-jbu-muted">本塁打</span>
                <span className="font-medium text-right">{season.leagueLeaders?.central?.hr}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-jbu-muted">打率</span>
                <span className="font-medium text-right">{season.leagueLeaders?.central?.avg}</span>
              </li>
            </ul>
          </div>
          <div className="bg-jbu-surface border border-jbu-border rounded-lg p-5">
            <SectionTitle kicker="LEADERS" title="パ・リーグ 主要部門" />
            <ul className="text-sm space-y-2">
              <li className="flex justify-between gap-3">
                <span className="text-jbu-muted">最多勝</span>
                <span className="font-medium text-right">{season.leagueLeaders?.pacific?.wins}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-jbu-muted">本塁打</span>
                <span className="font-medium text-right">{season.leagueLeaders?.pacific?.hr}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-jbu-muted">打率</span>
                <span className="font-medium text-right">{season.leagueLeaders?.pacific?.avg}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* HIGH SCHOOL + DRAFT */}
      <section className="grid lg:grid-cols-2 gap-4">
        <div className="bg-jbu-surface border border-jbu-border rounded-lg p-5">
          <SectionTitle kicker="HAKKYU-NO-KISEKI" title="高校野球 最新大会" />
          <ul className="space-y-3">
            {tournaments.map((t) => (
              <li key={t.id} className="flex items-start gap-3 border-l-2 border-jbu-accent/60 pl-3">
                <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-jbu-accent/15 text-jbu-accent shrink-0">
                  {t.grade}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{t.name}</div>
                  <div className="text-xs text-jbu-muted mt-0.5">
                    優勝: <span className="text-jbu-text">{t.champion}</span> ／ 準優勝: {t.runnerUp}
                  </div>
                  <div className="text-[10px] text-jbu-muted mt-1">{t.period}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-jbu-surface border border-jbu-border rounded-lg p-5">
          <SectionTitle
            kicker="DRAFT ARCHIVE"
            title={latestDraft ? `${latestDraft.year}年 ドラフト 注目指名` : "ドラフト"}
          />
          {latestDraft?.highlights?.length ? (
            <ul className="space-y-3">
              {latestDraft.highlights.map((h, i) => {
                const t = getTeamByName(h.team);
                return (
                  <li key={i} className="flex items-start gap-3">
                    <TeamBadge team={t} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm">{h.player}</span>
                        <span className="text-[10px] text-jbu-muted">{h.pos}</span>
                        <span className="text-[10px] text-jbu-muted">→ {t?.shortName ?? h.team}</span>
                      </div>
                      <div className="text-xs text-jbu-muted mt-0.5 leading-relaxed">
                        {h.text}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-xs text-jbu-muted">注目指名データが未投入です。</p>
          )}
          <div className="mt-3 text-[10px] text-jbu-muted">
            全 {drafts.length} 年分のアーカイブを保管中。
          </div>
        </div>
      </section>
    </div>
  );
}
