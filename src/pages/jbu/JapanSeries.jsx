import { useOutletContext } from "react-router-dom";
import { getJapanSeries, getTeamByName } from "../../lib/dataService";
import { ComingSoon, SectionCard } from "../../components/Placeholder";
import TeamBadge from "../../components/TeamBadge";

// Parses lines like "第3戦: 清澄 8 - 4 博多" into structured pieces.
// Falls back to the raw string when the shape can't be recognized.
function parseGame(line) {
  const m = line.match(
    /^第(\d+)戦[:：]?\s*(.+?)\s+(\d+)\s*[-ー―−]\s*(\d+)\s+(.+?)\s*$/
  );
  if (!m) return { raw: line };
  const [, g, teamA, sa, sb, teamB] = m;
  return {
    g: Number(g),
    teamA: teamA.trim(),
    scoreA: Number(sa),
    scoreB: Number(sb),
    teamB: teamB.trim(),
  };
}

function ScoreLine({ line, championName }) {
  const p = parseGame(line);
  if (p.raw) {
    return (
      <li className="flex items-center gap-3 py-2 px-3 bg-jbu-surface-2/60 rounded-md">
        <span className="text-sm text-jbu-text">{p.raw}</span>
      </li>
    );
  }

  const teamA = getTeamByName(p.teamA);
  const teamB = getTeamByName(p.teamB);
  const aWon = p.scoreA > p.scoreB;
  const bWon = p.scoreB > p.scoreA;
  const winnerName = aWon ? p.teamA : bWon ? p.teamB : null;
  const champWon = winnerName === championName;

  return (
    <li
      className={`grid grid-cols-[44px_1fr_auto_1fr] items-center gap-2 py-2 px-3 rounded-md border ${
        champWon
          ? "bg-jbu-accent/10 border-jbu-accent/40"
          : "bg-jbu-surface-2/60 border-jbu-border"
      }`}
    >
      <span className="font-display text-jbu-accent text-sm tabular-nums">
        第{p.g}戦
      </span>

      {/* Team A side */}
      <div
        className={`flex items-center justify-end gap-2 ${
          aWon ? "font-bold text-jbu-text" : "text-jbu-muted"
        }`}
      >
        <span className="text-sm truncate">
          {teamA?.shortName ?? p.teamA}
        </span>
        <TeamBadge team={teamA} size="sm" />
        <span className={`font-display tabular-nums text-lg w-7 text-right ${aWon ? "text-jbu-accent" : ""}`}>
          {p.scoreA}
        </span>
      </div>

      <span className="text-jbu-muted text-xs px-1">VS</span>

      {/* Team B side */}
      <div
        className={`flex items-center gap-2 ${
          bWon ? "font-bold text-jbu-text" : "text-jbu-muted"
        }`}
      >
        <span className={`font-display tabular-nums text-lg w-7 ${bWon ? "text-jbu-accent" : ""}`}>
          {p.scoreB}
        </span>
        <TeamBadge team={teamB} size="sm" />
        <span className="text-sm truncate">
          {teamB?.shortName ?? p.teamB}
        </span>
      </div>
    </li>
  );
}

export default function JapanSeries() {
  const { year } = useOutletContext();
  const js = getJapanSeries(year);
  if (!js) return <ComingSoon year={year} label="日本シリーズ" />;

  const champ = getTeamByName(js.champion);
  const sub = getTeamByName(js.subChampion);

  return (
    <div className="space-y-4">
      {/* HERO — Champion vs Sub */}
      <SectionCard kicker={`${js.year} JAPAN SERIES`} title={`${js.year} 日本シリーズ`}>
        <div className="grid sm:grid-cols-3 gap-4 items-center">
          <div className="text-center">
            <div className="text-[10px] tracking-widest text-jbu-accent">日本一</div>
            <div className="mt-2 flex flex-col items-center gap-2">
              <TeamBadge team={champ} size="xl" />
              <div className="text-lg font-bold">{champ?.shortName ?? js.champion}</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] tracking-widest text-jbu-muted">シリーズMVP</div>
            <div className="mt-2 text-sm font-bold leading-snug">{js.mvp}</div>
          </div>

          <div className="text-center">
            <div className="text-[10px] tracking-widest text-jbu-muted">準優勝</div>
            <div className="mt-2 flex flex-col items-center gap-2">
              <TeamBadge team={sub} size="xl" />
              <div className="text-lg font-bold">{sub?.shortName ?? js.subChampion}</div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* GAME-BY-GAME SCORES */}
      {js.scores?.length > 0 && (
        <SectionCard kicker="GAME SCORES" title="各試合のスコア">
          <ul className="space-y-2">
            {js.scores.map((line, i) => (
              <ScoreLine key={i} line={line} championName={js.champion} />
            ))}
          </ul>

          {/* Emphasized result banner below the score list */}
          {js.result && (
            <div className="mt-4 relative overflow-hidden rounded-md border border-jbu-accent/40 bg-gradient-to-r from-jbu-accent/15 via-jbu-surface-2 to-jbu-accent/15">
              <div className="px-5 py-4 flex items-center gap-3 justify-center text-center">
                <span className="text-[10px] tracking-[0.3em] text-jbu-accent">
                  FINAL RESULT
                </span>
                <span className="text-jbu-muted">|</span>
                <span className="font-display text-lg md:text-2xl tracking-wide text-jbu-text">
                  {js.result}
                </span>
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* SUMMARY */}
      {js.summary && (
        <SectionCard kicker="SUMMARY" title="シリーズ総括">
          <p className="text-sm leading-relaxed text-jbu-text/90">{js.summary}</p>
        </SectionCard>
      )}
    </div>
  );
}
