import { useOutletContext } from "react-router-dom";
import { getStandings, getTeamByName } from "../../lib/dataService";
import { ComingSoon } from "../../components/Placeholder";
import TeamBadge from "../../components/TeamBadge";

// NPB-style rate format: 0.6 → ".600", 0.21 → ".210". Leading zero stripped.
function rate(n) {
  if (n == null || isNaN(n)) return ".000";
  return Number(n).toFixed(3).replace(/^0\./, ".").replace(/^-0\./, "-.");
}
// Two-decimal ERA-style format that keeps the leading zero.
function era(n) {
  if (n == null || isNaN(n)) return "0.00";
  return Number(n).toFixed(2);
}
// Integer with thin "no data" placeholder when value is 0/null — keeps the
// table readable while signalling that some columns aren't yet filled in.
function intOrDash(n) {
  if (!n) return <span className="text-jbu-muted/40">—</span>;
  return n.toLocaleString();
}
function rateOrDash(n) {
  if (!n) return <span className="text-jbu-muted/40">—</span>;
  return rate(n);
}
function eraOrDash(n) {
  if (!n) return <span className="text-jbu-muted/40">—</span>;
  return era(n);
}

function StandingsTable({ league, rows }) {
  const accent = league === "central" ? "text-central" : "text-pacific";
  return (
    <div className="bg-jbu-surface border border-jbu-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-jbu-border">
        <div className={`text-[10px] tracking-widest ${accent}`}>
          {league === "central" ? "CENTRAL LEAGUE" : "PACIFIC LEAGUE"}
        </div>
        <div className="text-sm font-bold">
          {league === "central" ? "セ・リーグ" : "パ・リーグ"} 順位表
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[1080px]">
          <thead className="text-[10px] tracking-widest text-jbu-muted bg-jbu-surface-2">
            <tr>
              <th className="text-left px-3 py-2 w-8">#</th>
              <th className="text-left px-2 py-2">チーム</th>
              <th className="text-right px-2 py-2">勝</th>
              <th className="text-right px-2 py-2">負</th>
              <th className="text-right px-2 py-2">分</th>
              <th className="text-right px-2 py-2">勝率</th>
              <th className="text-right px-2 py-2">差</th>
              <th className="text-right px-2 py-2 border-l border-jbu-border">
                得点
              </th>
              <th className="text-right px-2 py-2">失点</th>
              <th className="text-right px-2 py-2 border-l border-jbu-border">
                打率
              </th>
              <th className="text-right px-2 py-2">本</th>
              <th className="text-right px-2 py-2">安</th>
              <th className="text-right px-2 py-2">OPS</th>
              <th className="text-right px-2 py-2 border-l border-jbu-border">
                防御率
              </th>
              <th className="text-right px-2 py-2">K</th>
              <th className="text-left px-3 py-2 hidden xl:table-cell">寸評</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const team = getTeamByName(r.teamName);
              return (
                <tr
                  key={`${r.rank ?? i}-${r.teamName}`}
                  className="border-t border-jbu-border hover:bg-jbu-surface-2/50"
                >
                  <td className="px-3 py-2 text-jbu-muted">{r.rank}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <TeamBadge team={team} size="sm" />
                      <span className="font-medium whitespace-nowrap">
                        {team?.shortName ?? r.teamName}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {r.wins}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {r.losses}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums text-jbu-muted">
                    {r.ties}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums font-medium">
                    {rate(r.pct)}
                  </td>
                  <td className="px-2 py-2 text-right text-jbu-muted tabular-nums">
                    {r.gamesBehind === 0 ? "-" : r.gamesBehind.toFixed(1)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums border-l border-jbu-border">
                    {intOrDash(r.runsScored)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {intOrDash(r.runsAllowed)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums border-l border-jbu-border">
                    {rateOrDash(r.teamAvg)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {intOrDash(r.homeRuns)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {intOrDash(r.hits)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {rateOrDash(r.ops)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums border-l border-jbu-border">
                    {eraOrDash(r.teamEra)}
                  </td>
                  <td className="px-2 py-2 text-right tabular-nums">
                    {intOrDash(r.strikeouts)}
                  </td>
                  <td className="px-3 py-2 text-xs text-jbu-muted max-w-md hidden xl:table-cell">
                    {r.comment || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile-friendly comment list, since the column above is hidden under xl. */}
      <ul className="xl:hidden divide-y divide-jbu-border border-t border-jbu-border">
        {rows
          .filter((r) => r.comment)
          .map((r, i) => {
            const team = getTeamByName(r.teamName);
            return (
              <li
                key={`${r.rank ?? i}-${r.teamName}`}
                className="px-4 py-2 flex items-start gap-2 text-xs"
              >
                <span className="text-jbu-muted tabular-nums w-4 shrink-0">
                  {r.rank}
                </span>
                <TeamBadge team={team} size="sm" />
                <span className="text-jbu-muted leading-snug">{r.comment}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default function Standings() {
  const { year } = useOutletContext();
  const standings = getStandings(year);

  if (!standings) return <ComingSoon year={year} label="チーム順位" />;

  return (
    <div className="space-y-4">
      <p className="text-[11px] text-jbu-muted">
        勝率は <code className="text-jbu-text">winPercentage</code>{" "}
        フィールド（無ければ wins/(wins+losses) で再計算）。「—」のセルは未入力データを示します。
      </p>
      <StandingsTable league="central" rows={standings.central} />
      <StandingsTable league="pacific" rows={standings.pacific} />
    </div>
  );
}
