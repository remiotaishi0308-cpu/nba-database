import { useOutletContext } from "react-router-dom";
import { getClimaxSeries, getTeamByName } from "../../lib/dataService";
import { ComingSoon } from "../../components/Placeholder";
import SectionTitle from "../../components/SectionTitle";
import TeamBadge from "../../components/TeamBadge";

// climaxSeries.json schema (per stage):
//   { winner, loser, winnerWins, loserWins,
//     advantageTo: "winner"|"loser"|null, advantageWins: 0|1,
//     games: [{ game, winnerScore, loserScore }, ...] }

function StageCard({ league, stageKicker, stageLabel, data }) {
  if (!data) return null;
  const games = Array.isArray(data.games) ? data.games : [];
  const winnerTeam = getTeamByName(data.winner);
  const loserTeam = getTeamByName(data.loser);
  const winnerAdv = data.advantageTo === "winner" ? data.advantageWins ?? 0 : 0;
  const loserAdv = data.advantageTo === "loser" ? data.advantageWins ?? 0 : 0;
  const accent = league === "central" ? "text-central" : "text-pacific";
  const winnerColor =
    winnerTeam?.primaryColor ?? "var(--color-jbu-accent, #facc15)";

  return (
    <div className="bg-jbu-surface border border-jbu-border rounded-lg overflow-hidden">
      {/* Header — stage label + final record */}
      <div className="px-4 py-3 border-b border-jbu-border flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className={`text-[10px] tracking-widest ${accent}`}>
            {stageKicker}
          </div>
          <div className="text-sm font-bold">{stageLabel}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] tracking-widest text-jbu-muted">
            SERIES
          </div>
          <div className="text-lg font-display leading-none tabular-nums">
            <span className="text-jbu-accent">{data.winnerWins ?? 0}</span>
            <span className="text-jbu-muted mx-0.5">-</span>
            <span className="text-jbu-muted">{data.loserWins ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Winner banner with team color stripe */}
      <div
        className="px-4 py-3 flex items-center gap-3 border-b border-jbu-border"
        style={{ borderLeft: `4px solid ${winnerColor}` }}
      >
        <TeamBadge team={winnerTeam} size="md" />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-widest text-jbu-accent">
            STAGE WINNER
          </div>
          <div className="text-sm font-bold truncate">
            {winnerTeam?.name ?? data.winner}
          </div>
        </div>
      </div>

      {/* Linescore table */}
      {games.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-jbu-surface-2/60 text-[10px] tracking-widest text-jbu-muted">
              <tr>
                <th className="text-left px-3 py-2 min-w-[110px]">チーム</th>
                {games.map((g) => (
                  <th
                    key={g.game}
                    className="px-2 py-2 tabular-nums text-center w-10"
                  >
                    G{g.game}
                  </th>
                ))}
                <th className="text-right px-3 py-2 w-12">勝</th>
              </tr>
            </thead>
            <tbody>
              <TeamRow
                team={winnerTeam}
                fallbackName={data.winner}
                games={games}
                scoreField="winnerScore"
                otherField="loserScore"
                totalWins={data.winnerWins}
                advWins={winnerAdv}
                isStageWinner
              />
              <TeamRow
                team={loserTeam}
                fallbackName={data.loser}
                games={games}
                scoreField="loserScore"
                otherField="winnerScore"
                totalWins={data.loserWins}
                advWins={loserAdv}
              />
            </tbody>
          </table>
        </div>
      )}

      {/* Advantage footnote */}
      {data.advantageWins > 0 && (
        <div className="px-4 py-2 text-[10px] text-jbu-muted bg-jbu-surface-2/40 border-t border-jbu-border">
          ※{" "}
          <span className="text-jbu-text">
            {data.advantageTo === "winner"
              ? winnerTeam?.shortName ?? data.winner
              : loserTeam?.shortName ?? data.loser}
          </span>
          （レギュラーシーズン上位）のアドバンテージ {data.advantageWins} 勝を含む
        </div>
      )}
    </div>
  );
}

function TeamRow({
  team,
  fallbackName,
  games,
  scoreField,
  otherField,
  totalWins,
  advWins,
  isStageWinner,
}) {
  return (
    <tr className="border-t border-jbu-border">
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <TeamBadge team={team} size="sm" />
          <span
            className={`whitespace-nowrap ${
              isStageWinner ? "font-bold text-jbu-text" : "text-jbu-muted"
            }`}
          >
            {team?.shortName ?? fallbackName}
          </span>
        </div>
      </td>
      {games.map((g) => {
        const score = g[scoreField];
        const wonGame = score > g[otherField];
        return (
          <td
            key={g.game}
            className={`text-center px-2 py-2.5 tabular-nums ${
              wonGame ? "font-bold text-jbu-text" : "text-jbu-muted"
            }`}
          >
            {score}
          </td>
        );
      })}
      <td
        className={`text-right px-3 py-2.5 tabular-nums ${
          isStageWinner ? "font-bold text-jbu-text" : "text-jbu-muted"
        }`}
      >
        {totalWins ?? 0}
        {advWins > 0 && (
          <span className="ml-1 text-[10px] text-jbu-accent">+{advWins}</span>
        )}
      </td>
    </tr>
  );
}

function LeagueBlock({ league, data }) {
  if (!data) return null;
  const labelPrefix = league === "central" ? "CENTRAL" : "PACIFIC";
  return (
    <div className="space-y-4">
      <StageCard
        league={league}
        stageKicker={`${labelPrefix} · FIRST STAGE`}
        stageLabel="ファーストステージ"
        data={data["ファーストステージ"]}
      />
      <StageCard
        league={league}
        stageKicker={`${labelPrefix} · FINAL STAGE`}
        stageLabel="ファイナルステージ"
        data={data["ファイナルステージ"]}
      />
    </div>
  );
}

export default function ClimaxSeries() {
  const { year } = useOutletContext();
  const cs = getClimaxSeries(year);
  if (!cs) return <ComingSoon year={year} label="クライマックスシリーズ" />;

  return (
    <div className="space-y-5">
      <SectionTitle
        kicker="POSTSEASON"
        title={`${year} クライマックスシリーズ`}
      />
      <p className="text-[11px] text-jbu-muted -mt-2">
        勝者 → 日本シリーズ進出。「+N」表記は当該球団がレギュラーシーズン優勝チームとして得たアドバンテージ勝を示します。
      </p>
      <div className="grid lg:grid-cols-2 gap-5">
        <LeagueBlock league="central" data={cs["セ・リーグ"]} />
        <LeagueBlock league="pacific" data={cs["パ・リーグ"]} />
      </div>
    </div>
  );
}
