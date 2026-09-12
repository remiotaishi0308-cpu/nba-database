import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  getTitles,
  getAwards,
  getMonthlyMvp,
  getTeamByName,
} from "../../../lib/dataService";
import { ComingSoon, SectionCard } from "../../../components/Placeholder";
import SectionTitle from "../../../components/SectionTitle";
import TeamBadge from "../../../components/TeamBadge";

const MONTHS = ["4月", "5月", "6月", "7月", "8月", "9月"];

// Canonical pitcher→DH order. Outfield is rendered as three rows so BN can be
// matched 1:1 against GG by index.
const POSITION_ORDER = [
  "投手",
  "捕手",
  "一塁手",
  "二塁手",
  "三塁手",
  "遊撃手",
  "外野手",
  "DH",
];

// ---------- sub-tab bar (local state, no URL change) ----------

function SubTabs({ tabs, active, onChange }) {
  return (
    <div className="border-b border-jbu-border overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={[
                "relative px-4 py-2.5 text-sm whitespace-nowrap transition-colors",
                isActive
                  ? "text-jbu-accent"
                  : "text-jbu-muted hover:text-jbu-text",
              ].join(" ")}
            >
              <span className="flex items-center gap-1.5">
                {t.icon && <span className="opacity-70">{t.icon}</span>}
                {t.label}
              </span>
              <span
                className={`absolute left-0 right-0 -bottom-px h-0.5 transition-all ${
                  isActive ? "bg-jbu-accent" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- shared chrome ----------

function LeagueCard({ league, children, title, kicker }) {
  const accent = league === "central" ? "text-central" : "text-pacific";
  const fallbackKicker = league === "central" ? "CENTRAL" : "PACIFIC";
  const fallbackTitle = league === "central" ? "セ・リーグ" : "パ・リーグ";
  return (
    <div className="bg-jbu-surface border border-jbu-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-jbu-border">
        <div className={`text-[10px] tracking-widest ${accent}`}>
          {kicker ?? fallbackKicker}
        </div>
        <div className="text-sm font-bold">{title ?? fallbackTitle}</div>
      </div>
      {children}
    </div>
  );
}

function PlayerCell({ name, teamName, note, align = "left" }) {
  const team = getTeamByName(teamName);
  if (!name) return <span className="text-jbu-muted text-xs">—</span>;
  return (
    <div className={`min-w-0 ${align === "right" ? "text-right" : ""}`}>
      <div
        className={`flex items-center gap-1.5 flex-wrap ${
          align === "right" ? "justify-end" : ""
        }`}
      >
        {team && <TeamBadge team={team} size="sm" />}
        <span className="font-medium text-sm whitespace-nowrap">{name}</span>
        <span className="text-[10px] text-jbu-muted whitespace-nowrap">
          {team?.shortName ?? teamName}
        </span>
      </div>
      {note && (
        <div className="text-[10px] text-jbu-muted mt-1 leading-relaxed">
          {note}
        </div>
      )}
    </div>
  );
}

// ---------- main titles ----------

function LeagueTitlesCard({ league, rows }) {
  if (!rows?.length) return null;
  const accent = league === "central" ? "text-central" : "text-pacific";
  return (
    <SectionCard
      kicker={league === "central" ? "CENTRAL TITLES" : "PACIFIC TITLES"}
      title={
        league === "central"
          ? "セ・リーグ 個人タイトル"
          : "パ・リーグ 個人タイトル"
      }
    >
      <ul className="divide-y divide-jbu-border">
        {rows.map((t, i) => {
          const team = getTeamByName(t.team);
          return (
            <li
              key={i}
              className="py-2.5 flex items-center gap-3 hover:bg-jbu-surface-2/50 -mx-5 px-5 transition-colors"
            >
              <div
                className={`text-[10px] tracking-widest w-32 shrink-0 ${accent}`}
              >
                {t.title}
              </div>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                {team && <TeamBadge team={team} size="sm" />}
                <span className="font-bold whitespace-nowrap">{t.player}</span>
                <span className="text-xs text-jbu-muted truncate">
                  {team?.shortName ?? t.team}
                </span>
              </div>
              {t.value && (
                <div className="text-sm tabular-nums font-bold">{t.value}</div>
              )}
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}

// ---------- monthly MVP ----------

function MonthlyMvpCard({ league, data }) {
  if (!data) return null;
  const pByMonth = Object.fromEntries(
    (data["投手"] ?? []).map((p) => [p.month, p])
  );
  const bByMonth = Object.fromEntries(
    (data["打者"] ?? []).map((p) => [p.month, p])
  );

  return (
    <LeagueCard league={league}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[420px]">
          <thead className="text-[10px] tracking-widest text-jbu-muted bg-jbu-surface-2">
            <tr>
              <th className="text-left px-3 py-2 w-14">月</th>
              <th className="text-left px-3 py-2">投手</th>
              <th className="text-left px-3 py-2 border-l border-jbu-border">
                打者
              </th>
            </tr>
          </thead>
          <tbody>
            {MONTHS.map((m) => {
              const p = pByMonth[m];
              const b = bByMonth[m];
              return (
                <tr
                  key={m}
                  className="border-t border-jbu-border hover:bg-jbu-surface-2/50 transition-colors"
                >
                  <td className="px-3 py-3 align-top">
                    <span className="font-display text-jbu-accent tabular-nums">
                      {m}
                    </span>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <PlayerCell
                      name={p?.player}
                      teamName={p?.team}
                      note={p?.note}
                    />
                  </td>
                  <td className="px-3 py-3 align-top border-l border-jbu-border">
                    <PlayerCell
                      name={b?.player}
                      teamName={b?.team}
                      note={b?.note}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </LeagueCard>
  );
}

// ---------- Field diagram (BN / GG visualizer) ----------

// Coordinates expressed as percentages within a square container.
// y grows downward; home plate sits near the bottom-center.
const FIELD_POSITIONS = [
  { key: "投手",  short: "P",  x: 50, y: 56 },
  { key: "捕手",  short: "C",  x: 50, y: 88 },
  { key: "一塁手", short: "1B", x: 74, y: 64 },
  { key: "二塁手", short: "2B", x: 62, y: 40 },
  { key: "三塁手", short: "3B", x: 26, y: 64 },
  { key: "遊撃手", short: "SS", x: 38, y: 40 },
  { key: "LF",   short: "LF", x: 16, y: 20 },
  { key: "CF",   short: "CF", x: 50, y: 10 },
  { key: "RF",   short: "RF", x: 84, y: 20 },
  { key: "DH",   short: "DH", x: 92, y: 94 },
];

// Bucket BN/GG rows into a {position → row} map. Outfield array is fanned out
// to LF / CF / RF slots in registration order so the diagram has one slot per
// player.
function bucketForField(rows) {
  const out = {};
  const outfield = [];
  for (const r of rows ?? []) {
    if (!r?.position) continue;
    if (r.position === "外野手") {
      outfield.push(r);
    } else {
      out[r.position] = r;
    }
  }
  const fanOut = ["LF", "CF", "RF"];
  outfield.slice(0, 3).forEach((r, i) => {
    out[fanOut[i]] = r;
  });
  return out;
}

function PillToggle({ options, value, onChange, className = "" }) {
  return (
    <div
      className={`inline-flex bg-jbu-surface-2 border border-jbu-border rounded-md p-0.5 ${className}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={[
              "px-3 py-1 text-xs font-bold rounded-sm transition-colors",
              active
                ? "bg-jbu-accent text-jbu-bg"
                : "text-jbu-muted hover:text-jbu-text",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function FieldSvg() {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="grass" cx="50%" cy="60%" r="70%">
          <stop offset="0%" stopColor="#1f4a2e" />
          <stop offset="100%" stopColor="#0d2a18" />
        </radialGradient>
      </defs>
      {/* canvas */}
      <rect width="100" height="100" fill="#0a1410" />
      {/* outfield fan (foul-line to foul-line) */}
      <path
        d="M 50 82 L 8 38 A 60 60 0 0 1 92 38 Z"
        fill="url(#grass)"
      />
      {/* warning track edge */}
      <path
        d="M 50 82 L 8 38 A 60 60 0 0 1 92 38"
        fill="none"
        stroke="#3a6b48"
        strokeWidth="0.4"
        strokeOpacity="0.6"
      />
      {/* infield dirt diamond */}
      <path d="M 50 82 L 72 60 L 50 38 L 28 60 Z" fill="#73553a" />
      {/* infield grass (inside the basepaths) */}
      <path d="M 50 76 L 66 60 L 50 44 L 34 60 Z" fill="#1f4a2e" />
      {/* foul lines */}
      <line
        x1="50" y1="82" x2="8"  y2="40"
        stroke="white" strokeOpacity="0.5" strokeWidth="0.3"
      />
      <line
        x1="50" y1="82" x2="92" y2="40"
        stroke="white" strokeOpacity="0.5" strokeWidth="0.3"
      />
      {/* bases (rotated 45°) */}
      {[
        { x: 50, y: 82 }, // home
        { x: 72, y: 60 }, // 1B
        { x: 50, y: 38 }, // 2B
        { x: 28, y: 60 }, // 3B
      ].map((b, i) => (
        <rect
          key={i}
          x={b.x - 1.4}
          y={b.y - 1.4}
          width="2.8"
          height="2.8"
          fill="white"
          fillOpacity="0.85"
          transform={`rotate(45 ${b.x} ${b.y})`}
        />
      ))}
      {/* pitcher's mound */}
      <circle cx="50" cy="60" r="3.2" fill="#8a6845" />
      <circle cx="50" cy="60" r="0.8" fill="white" fillOpacity="0.7" />
    </svg>
  );
}

function FieldPositionCard({ pos, row, doubleAward }) {
  const team = getTeamByName(row?.team);
  const accent = team?.primaryColor ?? "var(--color-jbu-accent, #facc15)";
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      <div className="flex flex-col items-center gap-0.5">
        <span
          className="text-[9px] tracking-widest font-bold px-1.5 py-0.5 rounded-sm"
          style={{ background: accent, color: "#0a1410" }}
        >
          {pos.short}
        </span>
        <div
          className="bg-jbu-bg/85 backdrop-blur-sm border rounded-md px-1.5 py-1 flex items-center gap-1 shadow-lg"
          style={{ borderColor: accent }}
        >
          <TeamBadge team={team} size="sm" />
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-bold whitespace-nowrap">
              {row?.player ?? "—"}
            </span>
            <span className="text-[8px] text-jbu-muted whitespace-nowrap">
              {team?.shortName ?? row?.team ?? ""}
            </span>
          </div>
          {doubleAward && (
            <span
              className="text-[8px] tracking-widest font-bold ml-0.5"
              style={{ color: accent }}
              title="ベストナイン・ゴールデングラブ両賞獲得"
            >
              ★W
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldDiagram({ awards }) {
  const [league, setLeague] = useState("central");
  const [award, setAward] = useState("bn");

  const leagueKey = league === "central" ? "セ・リーグ" : "パ・リーグ";
  const leagueData = awards.leagues?.[leagueKey] ?? {};
  const bnRows = leagueData["ベストナイン"] ?? [];
  const ggRows = leagueData["ゴールデングラブ"] ?? [];

  const activeRows = award === "bn" ? bnRows : ggRows;
  const otherRows  = award === "bn" ? ggRows : bnRows;
  const activeMap = bucketForField(activeRows);
  const otherMap  = bucketForField(otherRows);

  const hasAny = bnRows.length || ggRows.length;
  const accentClass = league === "central" ? "text-central" : "text-pacific";

  return (
    <div className="bg-jbu-surface border border-jbu-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-jbu-border flex flex-wrap items-center gap-3 justify-between">
        <div>
          <div className={`text-[10px] tracking-widest ${accentClass}`}>
            {league === "central" ? "CENTRAL" : "PACIFIC"} · FIELD VIEW
          </div>
          <div className="text-sm font-bold">
            {leagueKey}{" "}
            {award === "bn" ? "ベストナイン" : "ゴールデングラブ"}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <PillToggle
            options={[
              { value: "central", label: "セ" },
              { value: "pacific", label: "パ" },
            ]}
            value={league}
            onChange={setLeague}
          />
          <PillToggle
            options={[
              { value: "bn", label: "ベストナイン" },
              { value: "gg", label: "ゴールデングラブ" },
            ]}
            value={award}
            onChange={setAward}
          />
        </div>
      </div>

      {!hasAny ? (
        <div className="p-8 text-center text-xs text-jbu-muted">
          このリーグのベストナイン / ゴールデングラブ データは未登録です。
        </div>
      ) : (
        <div className="p-3 md:p-6">
          <div className="relative aspect-square max-w-[580px] mx-auto">
            <FieldSvg />
            {FIELD_POSITIONS.map((pos) => {
              const row = activeMap[pos.key];
              if (!row) return null;
              const counter = otherMap[pos.key];
              const doubleAward =
                counter && counter.player === row.player;
              return (
                <FieldPositionCard
                  key={pos.key}
                  pos={pos}
                  row={row}
                  doubleAward={doubleAward}
                />
              );
            })}
          </div>
          <p className="mt-3 text-[10px] text-jbu-muted text-center">
            外野手はデータ登録順に LF → CF → RF の位置に配置（守備位置の厳密な対応ではありません）。
            <span className="ml-1.5 font-bold" style={{ color: "var(--color-jbu-accent, #facc15)" }}>
              ★W
            </span>{" "}
            は同年の攻守両賞獲得を示します。
          </p>
        </div>
      )}
    </div>
  );
}

// ---------- BN + GG side-by-side ----------

// Returns an array of rows aligned by canonical position.
// Outfield slots are split into ①②③ so BN[index] pairs with GG[index].
function buildSideBySide(bnList, ggList) {
  const bn = Array.isArray(bnList) ? bnList : [];
  const gg = Array.isArray(ggList) ? ggList : [];

  const bucket = (list) => {
    const out = {};
    for (const r of list) {
      if (!r?.position) continue;
      (out[r.position] ??= []).push(r);
    }
    return out;
  };
  const bnByPos = bucket(bn);
  const ggByPos = bucket(gg);

  const rows = [];
  for (const pos of POSITION_ORDER) {
    const bnSlot = bnByPos[pos] ?? [];
    const ggSlot = ggByPos[pos] ?? [];
    const slots = Math.max(bnSlot.length, ggSlot.length);
    if (slots === 0) continue;
    if (slots === 1) {
      rows.push({ position: pos, bn: bnSlot[0], gg: ggSlot[0] });
    } else {
      const marks = ["①", "②", "③", "④"];
      for (let i = 0; i < slots; i++) {
        rows.push({
          position: `${pos} ${marks[i] ?? i + 1}`,
          bn: bnSlot[i],
          gg: ggSlot[i],
        });
      }
    }
  }
  return rows;
}

function PositionCompareCard({ league, bn, gg }) {
  const rows = buildSideBySide(bn, gg);
  if (!rows.length) return null;
  return (
    <LeagueCard league={league}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead className="text-[10px] tracking-widest text-jbu-muted bg-jbu-surface-2">
            <tr>
              <th className="text-left px-3 py-2 w-24">ポジション</th>
              <th className="text-left px-3 py-2">
                <span className="text-jbu-accent">BEST NINE</span>
                <span className="ml-2 text-jbu-muted">ベストナイン</span>
              </th>
              <th className="text-left px-3 py-2 border-l border-jbu-border">
                <span className="text-jbu-accent">GOLDEN GLOVE</span>
                <span className="ml-2 text-jbu-muted">ゴールデングラブ</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const same =
                r.bn && r.gg && r.bn.player === r.gg.player;
              return (
                <tr
                  key={r.position}
                  className="border-t border-jbu-border hover:bg-jbu-surface-2/50 transition-colors"
                >
                  <td className="px-3 py-3 align-top text-jbu-muted whitespace-nowrap font-medium">
                    {r.position}
                    {same && (
                      <span className="ml-1.5 text-[9px] tracking-widest text-jbu-accent">
                        ★W
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-top">
                    <PlayerCell
                      name={r.bn?.player}
                      teamName={r.bn?.team}
                    />
                  </td>
                  <td className="px-3 py-3 align-top border-l border-jbu-border">
                    <PlayerCell
                      name={r.gg?.player}
                      teamName={r.gg?.team}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </LeagueCard>
  );
}

// ---------- page ----------

const TABS = [
  { id: "main", label: "主要タイトル", icon: "♛" },
  { id: "monthly", label: "月間MVP", icon: "◷" },
  { id: "best-glove", label: "ベストナイン / ゴールデングラブ", icon: "◆" },
];

export default function Awards() {
  const { year } = useOutletContext();
  const [activeTab, setActiveTab] = useState("main");

  const titles = getTitles(year);
  const monthly = getMonthlyMvp(year);
  const awards = getAwards(year);

  if (!titles && !monthly && !awards) {
    return <ComingSoon year={year} label="表彰・タイトル" />;
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <SectionTitle kicker="AWARDS" title="表彰・タイトル" />
        <p className="text-sm text-jbu-muted max-w-3xl">
          月間MVP・ベストナイン・ゴールデングラブ賞を1つの画面で切り替えられる
          表彰セクションです。
        </p>
      </div>
      <SubTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === "main" && <MainTab titles={titles} year={year} />}
      {activeTab === "monthly" && (
        <MonthlyTab monthly={monthly} year={year} />
      )}
      {activeTab === "best-glove" && (
        <BestGloveTab awards={awards} year={year} />
      )}
    </div>
  );
}

function MainTab({ titles, year }) {
  if (!titles) return <ComingSoon year={year} label="主要タイトル" />;
  const central = titles.leagues?.["セ・リーグ"] ?? [];
  const pacific = titles.leagues?.["パ・リーグ"] ?? [];
  return (
    <section>
      <SectionTitle kicker="LEAGUE TITLES" title="個人タイトル (主要部門)" />
      <div className="grid lg:grid-cols-2 gap-4">
        <LeagueTitlesCard league="central" rows={central} />
        <LeagueTitlesCard league="pacific" rows={pacific} />
      </div>
    </section>
  );
}

function MonthlyTab({ monthly, year }) {
  if (!monthly) return <ComingSoon year={year} label="月間MVP" />;
  return (
    <section>
      <SectionTitle kicker="MONTHLY MVP" title="月間MVP" />
      <div className="grid lg:grid-cols-2 gap-4">
        <MonthlyMvpCard
          league="central"
          data={monthly.leagues?.["セ・リーグ"]}
        />
        <MonthlyMvpCard
          league="pacific"
          data={monthly.leagues?.["パ・リーグ"]}
        />
      </div>
    </section>
  );
}

function BestGloveTab({ awards, year }) {
  if (!awards) {
    return <ComingSoon year={year} label="ベストナイン / ゴールデングラブ" />;
  }
  const central = awards.leagues?.["セ・リーグ"] ?? {};
  const pacific = awards.leagues?.["パ・リーグ"] ?? {};
  return (
    <section className="space-y-6">
      <SectionTitle
        kicker="BEST NINE / GOLDEN GLOVE"
        title="ベストナイン / ゴールデングラブ賞"
      />
      <p className="text-[11px] text-jbu-muted -mt-2">
        フィールド図と比較表で攻守の両賞を並べて確認できます。
        <span className="text-jbu-accent">★W</span>{" "}
        は同じ選手が両賞を獲得（攻守二刀）したことを示します。
      </p>

      {/* 1) Field-of-play visualization */}
      <FieldDiagram awards={awards} />

      {/* 2) Position-by-position comparison table */}
      <div>
        <div className="text-[10px] tracking-widest text-jbu-muted mb-2 px-1">
          POSITION COMPARISON · ポジション別 比較表
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <PositionCompareCard
            league="central"
            bn={central["ベストナイン"]}
            gg={central["ゴールデングラブ"]}
          />
          <PositionCompareCard
            league="pacific"
            bn={pacific["ベストナイン"]}
            gg={pacific["ゴールデングラブ"]}
          />
        </div>
      </div>
    </section>
  );
}
