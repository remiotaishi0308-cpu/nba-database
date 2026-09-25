import { useState, useEffect, Fragment } from "react";
import { getSeasonData, getArticlesByYear, MLB_SEASON_YEARS, seasonLabel } from "../../lib/dataService";
import "./season2042.css";

/* ============================================================================
 *  JBU 2042 (MLB era) — 既存アプリ内の年度ポータルから year>=2042 で描画される
 *  自己完結セクション。データは src/data/jbu2042.json（dataService経由）。
 *  スタイルは season2042.css に .jbu2042 スコープで定義。
 * ==========================================================================*/

// 選択年のデータ。applyYear(year) で差し替える（子コンポーネントはこの
// モジュールレベルの DATA/TEAM_BY_KEY/TEAM_DATA を参照する）。
let DATA;

const GRADS = [
  "linear-gradient(135deg,#0d3b2e,#062018)",
  "linear-gradient(135deg,#1a2f4a,#0a1422)",
  "linear-gradient(135deg,#3a1f0d,#1a0e05)",
  "linear-gradient(135deg,#2a0d3a,#120618)",
  "linear-gradient(135deg,#0d2a3a,#05141c)",
];
// リーグ構成は DATA.league を唯一の出典とする。カンファレンス・ディビジョン・
// プレーオフ枠・クリンチ記号を増減してもコード修正は不要（データだけで反映）。
const LEAGUE = () => DATA?.league || {};
const CONFS = () => {
  const cs = LEAGUE().conferences;
  return Array.isArray(cs) && cs.length
    ? cs
    : [{ key: "East", name: "イースタン", label: "Eastern", divisions: [] }];
};
const PLAYOFF = () => LEAGUE().playoff || {};
const confRows = (key) => DATA?.standings?.[key] || [];
// カンファレンス識別色はデータ順に割り当て（3つ目以降も破綻しない）
const CONF_COLORS = ["var(--al)", "var(--nl)", "var(--accent)", "var(--gold)"];
const confColor = (key) => {
  const i = CONFS().findIndex((c) => c.key === key);
  return CONF_COLORS[(i < 0 ? 0 : i) % CONF_COLORS.length];
};
// そのカンファレンス/ディビジョンに属するクラブを順位順で返す
const teamsInDivision = (confKey, divKey) =>
  confRows(confKey)
    .map((r, i) => ({ row: r, rank: i + 1, t: team(r.team) }))
    .filter((x) => !divKey || x.t.division === divKey);

// 略称(abbr)でもチーム名(name)でも解決できるルックアップ。
// 順位表などで team 欄に "HOK" でも "北海道" でも入力可。
let TEAM_BY_KEY = {};
let TEAM_DATA = {};
const EMPTY_SEASON = {
  league: {}, teams: {}, prospects: [], teamStats: {},
  standings: {},
  postseason: {
    conferences: {}, finals: {}, cup: null,
    gallery: { hero: [], series: [], recap: [] },
    recap: { headline: "", body: [], moments: [] },
  },
  awards: { voting: [], allTeams: [], statTitles: [], monthly: [], weekly: [], allStar: null, postseasonMvp: [] },
};
function applyYear(year) {
  DATA = getSeasonData(year) || getSeasonData(MLB_SEASON_YEARS[0]) || { season: year, ...EMPTY_SEASON };
  TEAM_BY_KEY = {};
  for (const [abbr, t] of Object.entries(DATA.teams || {})) {
    TEAM_BY_KEY[abbr] = t;
    if (t?.name) TEAM_BY_KEY[t.name] = t;
  }
  // 参入予定クラブ（league.incomingTeams）もドラフト等で参照されるため解決対象に含める
  for (const t of (DATA.league && DATA.league.incomingTeams) || []) {
    if (t && t.abbr && !TEAM_BY_KEY[t.abbr]) TEAM_BY_KEY[t.abbr] = t;
    if (t && t.name && !TEAM_BY_KEY[t.name]) TEAM_BY_KEY[t.name] = t;
  }
  TEAM_DATA = DATA.teamStats || {};
}
const team = (key) => {
  if (TEAM_BY_KEY[key]) return TEAM_BY_KEY[key];
  if (typeof key === "string" && key.length >= 2) {
    const teams = Object.values(DATA.teams);
    const hit = teams.find((t) => {
      if (t.abbr && t.abbr.length >= 2 && key.startsWith(t.abbr)) return true;
      if (!t.name) return false;
      return (
        key.startsWith(t.name) ||
        t.name.startsWith(key) ||
        key.includes(t.name) ||
        t.name.includes(key)
      );
    });
    if (hit) return hit;
    let best = null, bestLen = 1;
    for (const t of teams) {
      if (!t.name) continue;
      let n = 0;
      const L = Math.min(key.length, t.name.length);
      while (n < L && key[n] === t.name[n]) n++;
      if (n >= 2 && n > bestLen) { bestLen = n; best = t; }
    }
    if (best) return best;
  }
  return { name: key, abbr: key, color: "#555" };
};

// 記事は CMS（src/content/articles の season=2042）が唯一の供給元。/admin で
// 追加・編集すると、この 2042 ページとグローバルの記事一覧の両方に反映される。
// CMS の記事オブジェクトを、この画面のコンポーネントが期待する形へ変換する。
function adaptArticle(a, i) {
  return {
    id: a.id,
    date: a.date,
    cat: a.category,
    title: a.title,
    excerpt: a.summary,
    thumbnailUrl: a.thumbnailUrl,
    grad: i,
    body: String(a.content || "")
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean),
    photoUrls: [],
  };
}
// 日付の新しい順（getArticlesByYear が降順で返す）。トップはこの先頭、残りは News タブ。
const sortedArticles = () => getArticlesByYear(DATA.season).map(adaptArticle);

// 記事サムネ：thumbnailUrl があれば画像、無ければグラデーション。
const thumbBg = (a) =>
  a.thumbnailUrl
    ? { backgroundImage: `url(${a.thumbnailUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: GRADS[a.grad % GRADS.length] };

// 本文の簡易マークダウン: "## " → 見出し / "> " → 引用 / それ以外 → 段落。
function renderArticleBlock(line, i) {
  if (typeof line !== "string") return null;
  // 本文中の画像（CMS が出力する Markdown 画像 ![説明](パス)）。
  const img = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
  if (img)
    return (
      <img
        key={i}
        src={img[2]}
        alt={img[1]}
        loading="lazy"
        style={{ width: "100%", borderRadius: 8, margin: "12px 0" }}
      />
    );
  if (line.startsWith("## ")) return <h3 key={i} className="article-h">{line.slice(3)}</h3>;
  if (line.startsWith("■")) return <h3 key={i} className="article-h">{line.replace(/^■\s*/, "")}</h3>;
  if (line.startsWith("> ")) return <blockquote key={i} className="article-quote">{line.slice(2)}</blockquote>;
  return <p key={i}>{line}</p>;
}

function Badge({ abbr, size = 22 }) {
  const [failed, setFailed] = useState(false);
  if (!abbr) return null;
  const t = team(abbr);
  // ロゴ画像があれば画像。未アップロード/読み込み失敗なら色バッジへフォールバック。
  if (t.logo && !failed) {
    return (
      <img
        src={t.logo}
        alt={t.abbr}
        className="team-logo"
        loading="lazy"
        onError={() => setFailed(true)}
        style={{ height: size, width: size, objectFit: "contain", borderRadius: 4, verticalAlign: "middle", flex: "none" }}
      />
    );
  }
  return <span className="badge" style={{ background: t.color }}>{t.abbr}</span>;
}
function TeamCell({ abbr, full }) {
  if (!abbr) return <span className="muted">—</span>;
  const t = team(abbr);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <Badge abbr={abbr} /><span style={{ fontWeight: 600 }}>{full ? t.name : t.abbr}</span>
    </span>
  );
}
function Player({ name, t }) {
  if (!name || name === "—") return <span className="muted">—</span>;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
      {t ? <Badge abbr={t} /> : null}
      <span style={{ fontWeight: 600 }}>{name}</span>
      {t ? <span className="muted" style={{ fontSize: 14 }}>{team(t).abbr}</span> : null}
    </span>
  );
}
function SectionHead({ kicker, title, right }) {
  return (
    <div className="section-head" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <div><div className="kicker">{kicker}</div><h2 className="section-title">{title}</h2></div>
      {right}
    </div>
  );
}
function LeagueToggle({ value, onChange }) {
  return (
    <div className="toggle">
      {CONFS().map((c, i) => (
        <button
          key={c.key}
          className={
            value === c.key ? (i === 0 ? "on al" : i === 1 ? "on nl" : "on acc") : ""
          }
          onClick={() => onChange(c.key)}
        >
          {c.label || c.name}
        </button>
      ))}
    </div>
  );
}

/* ---- HOME ---- */
function NewsSlider({ items, onOpen }) {
  const [i, setI] = useState(0);
  const go = (d) => setI((p) => (p + d + items.length) % items.length);
  // 最新記事を自動で送るカルーセル（手動の矢印・ドットも併用）。
  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);
  const a = items[i % items.length];
  if (!a) return null;
  return (
    <div className="hero">
      <div className="hero-bg" style={thumbBg(a)} />
      <div className="hero-grad" />
      <div className="hero-arrows"><button className="prev" onClick={() => go(-1)}>‹</button><button className="next" onClick={() => go(1)}>›</button></div>
      <div className="hero-content" style={{ cursor: "pointer" }} onClick={() => onOpen(a.id)}>
        <span className="hero-cat">{a.cat}</span>
        <h1 className="hero-title">{a.title}</h1>
        <p className="hero-excerpt">{a.excerpt}</p>
      </div>
      <div className="hero-dots">{items.map((_, k) => <button key={k} className={"hero-dot" + (k === i ? " active" : "")} onClick={() => setI(k)} />)}</div>
    </div>
  );
}
function SubNews({ items, onOpen }) {
  return (
    <div className="card">
      <div className="card-head"><span className="kicker">Latest</span><span className="muted" style={{ fontSize: 14 }}>NEWS</span></div>
      <div className="card-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
        {items.map((s) => (
          <div className="sub-item" key={s.id} onClick={() => onOpen(s.id)}>
            <div className="sub-thumb" style={thumbBg(s)} />
            <div style={{ minWidth: 0 }}>
              <div className="sub-cat">{s.cat}</div>
              <div className="sub-title">{s.title}</div>
              <div className="sub-date mono">{s.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function MiniStandingsBlock({ conf }) {
  const rows = confRows(conf.key);
  const po = PLAYOFF();
  const direct = po.directBerths ?? 6;
  const piEnd = po.playInEnd ?? 10;
  return (
    <div className="card">
      <div className="card-head">
        <span className="kicker" style={{ color: confColor(conf.key) }}>
          {conf.label || conf.name}
        </span>
        <span className="muted" style={{ fontSize: 14 }}>{rows.length} クラブ</span>
      </div>
      <div className="table-scroll"><table>
        <thead><tr>
          <th>#</th><th>CLUB</th>
          <th className="num">W</th><th className="num">L</th>
          <th className="num">PCT</th><th className="num">GB</th>
        </tr></thead>
        <tbody>
          {rows.slice(0, piEnd).map((r, i) => (
            <Fragment key={r.team}>
              <tr>
                <td className="rank-cell">{i + 1}</td>
                <td style={{ whiteSpace: "nowrap" }}><ClinchTag c={r.clinch} /><TeamCell abbr={r.team} /></td>
                <td className="num mono">{r.w}</td>
                <td className="num mono">{r.l}</td>
                <td className="num mono">{pct(r.w, r.l)}</td>
                <td className="num mono muted">{sv(r.gb)}</td>
              </tr>
              {i + 1 === direct ? <CutRow label={`プレイオフ進出ライン（1〜${direct}位）`} colSpan={6} /> : null}
            </Fragment>
          ))}
        </tbody>
      </table></div>
    </div>
  );
}
function HomePage({ go, onOpen }) {
  const sorted = sortedArticles();
  // トップは最新5枚をカルーセル表示。LATEST にも同じ最新5枚を一覧。
  const featured = sorted.slice(0, 5);
  const subList = sorted.slice(0, 5);
  const cup = DATA.postseason?.cup;
  return (
    <div>
      <SectionHead kicker={`Season ${seasonLabel(DATA.season)}`} title="トップニュース"
        right={<button className="season-pill" onClick={() => go("news")} style={{ cursor: "pointer" }}>記事一覧 →</button>} />
      <div className="home-grid">
        <NewsSlider items={featured} onOpen={onOpen} /><SubNews items={subList} onOpen={onOpen} />
      </div>

      <SectionHead kicker="Standings" title="順位表"
        right={<button className="season-pill" onClick={() => go("standings")} style={{ cursor: "pointer" }}>すべて見る →</button>} />
      <div className="grid g2">
        {CONFS().map((c) => <MiniStandingsBlock key={c.key} conf={c} />)}
      </div>

      {cup && cup.champ ? (
        <>
          <SectionHead kicker="In-Season Tournament" title={cup.name || "NBAカップ"} />
          <CupBlock />
        </>
      ) : null}

      <SectionHead kicker="Postseason" title="プレーオフ"
        right={<button className="season-pill" onClick={() => go("postseason")} style={{ cursor: "pointer" }}>詳細・総括 →</button>} />
      <PlayoffFormatNote />
      <div className="grid g2">
        {CONFS().map((c) => <ConferenceBracket key={c.key} conf={c} />)}
      </div>
    </div>
  );
}

/* ---- STANDINGS ---- */
function pct(w, l) { const d = w + l; return d ? (w / d).toFixed(3).replace(/^0/, "") : ".000"; }
// 空欄は「—」表示。
const sv = (x) => (x === "" || x == null ? "—" : x);

// クリンチ記号（z＝カンファレンス首位確定 / x＝プレイオフ出場決定 / pi＝プレイイン進出確定）。
// 記号と意味は DATA.league.clinchMarks から読むので、追加・変更はデータ側だけで済む。
const CLINCH_COLOR = { z: "var(--accent)", x: "var(--al)", pi: "var(--gold)" };
function ClinchTag({ c }) {
  if (!c) return null;
  const k = String(c).toLowerCase();
  return (
    <span
      className="mono"
      style={{ color: CLINCH_COLOR[k] || "var(--muted)", fontWeight: 700, marginRight: 6, fontSize: 14 }}
      title={(LEAGUE().clinchMarks || []).find((m) => m.key === k)?.label || ""}
    >
      {k}
    </span>
  );
}
function ClinchLegend() {
  const marks = LEAGUE().clinchMarks || [];
  if (!marks.length) return null;
  return (
    <span className="muted" style={{ fontSize: 14 }}>
      {marks.map((m, i) => (
        <span key={m.key} style={{ whiteSpace: "nowrap" }}>
          {i > 0 ? " ／ " : ""}
          <b style={{ color: CLINCH_COLOR[m.key] || "var(--muted)" }}>{m.key}</b>＝{m.label}
        </span>
      ))}
    </span>
  );
}

// プレーオフ圏／プレイイン圏の境界線
function CutRow({ label, colSpan }) {
  return (
    <tr className="cut-row">
      <td colSpan={colSpan}>{label}</td>
    </tr>
  );
}

const STANDINGS_COLS = [
  { key: "w", label: "W" }, { key: "l", label: "L" },
  { key: "pct", label: "PCT" }, { key: "gb", label: "GB" },
  { key: "conf", label: "CONF" }, { key: "div", label: "DIV" },
  { key: "home", label: "HOME" }, { key: "away", label: "AWAY" },
  { key: "l10", label: "L10" }, { key: "strk", label: "STRK" },
  { key: "diff", label: "DIFF" },
];

function StandingsRowCells({ r }) {
  return (
    <>
      <td className="num mono">{r.w}</td>
      <td className="num mono">{r.l}</td>
      <td className="num mono">{pct(r.w, r.l)}</td>
      <td className="num mono muted">{sv(r.gb)}</td>
      <td className="num mono">{sv(r.conf)}</td>
      <td className="num mono">{sv(r.div)}</td>
      <td className="num mono">{sv(r.home)}</td>
      <td className="num mono">{sv(r.away)}</td>
      <td className="num mono">{sv(r.l10)}</td>
      <td className="num mono" style={{ color: r.strk && r.strk[0] === "W" ? "var(--accent)" : "var(--muted)" }}>{sv(r.strk)}</td>
      <td className="num mono">{sv(r.diff)}</td>
    </>
  );
}

// カンファレンス順位表（勝率順・プレーオフ境界つき）
function ConferenceStandings({ conf }) {
  const rows = confRows(conf.key);
  const po = PLAYOFF();
  const direct = po.directBerths ?? 6;
  const piEnd = po.playInEnd ?? 10;
  const total = STANDINGS_COLS.length + 2;
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-head">
        <span className="kicker" style={{ color: confColor(conf.key) }}>{conf.label || conf.name}</span>
        <span className="muted" style={{ fontSize: 14 }}>{conf.name}・{rows.length} クラブ</span>
      </div>
      <div className="table-scroll"><table>
        <thead><tr>
          <th>#</th><th>CLUB</th>
          {STANDINGS_COLS.map((c) => <th key={c.key} className="num">{c.label}</th>)}
        </tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <Fragment key={r.team}>
              <tr>
                <td className="rank-cell">{i + 1}</td>
                <td style={{ whiteSpace: "nowrap" }}><ClinchTag c={r.clinch} /><TeamCell abbr={r.team} full /></td>
                <StandingsRowCells r={r} />
              </tr>
              {i + 1 === direct ? <CutRow label={`プレイオフ本戦 進出ライン（1〜${direct}位）`} colSpan={total} /> : null}
              {i + 1 === piEnd && rows.length > piEnd ? <CutRow label={`プレイイン圏（${po.playInStart ?? direct + 1}〜${piEnd}位）ここまで`} colSpan={total} /> : null}
            </Fragment>
          ))}
        </tbody>
      </table></div>
    </div>
  );
}

// ディビジョン別の表示（順位はカンファレンス内順位をそのまま表示）
function DivisionStandings({ conf }) {
  const divs = conf.divisions && conf.divisions.length ? conf.divisions : [{ key: null, name: conf.name }];
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="kicker" style={{ color: confColor(conf.key), margin: "8px 0 10px" }}>
        {conf.label || conf.name}
      </div>
      <div className="grid g2">
        {divs.map((d) => {
          const list = teamsInDivision(conf.key, d.key);
          return (
            <div className="card" key={d.key || "all"}>
              <div className="card-head">
                <span className="kicker" style={{ color: confColor(conf.key) }}>{d.name}・ディビジョン</span>
                <span className="muted" style={{ fontSize: 14 }}>{list.length} クラブ</span>
              </div>
              <div className="table-scroll"><table>
                <thead><tr>
                  <th>#</th><th>CLUB</th>
                  <th className="num">W</th><th className="num">L</th>
                  <th className="num">PCT</th><th className="num">GB</th>
                </tr></thead>
                <tbody>
                  {list.map(({ row, rank }) => (
                    <tr key={row.team}>
                      <td className="rank-cell" title="カンファレンス内順位">{rank}</td>
                      <td style={{ whiteSpace: "nowrap" }}><ClinchTag c={row.clinch} /><TeamCell abbr={row.team} full /></td>
                      <td className="num mono">{row.w}</td>
                      <td className="num mono">{row.l}</td>
                      <td className="num mono">{pct(row.w, row.l)}</td>
                      <td className="num mono muted">{sv(row.gb)}</td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StandingsPage() {
  const [view, setView] = useState("conf");
  const po = PLAYOFF();
  return (
    <div>
      <SectionHead
        kicker="Standings"
        title="順位表"
        right={
          <div className="toggle">
            <button className={view === "conf" ? "on acc" : ""} onClick={() => setView("conf")}>カンファレンス</button>
            <button className={view === "div" ? "on acc" : ""} onClick={() => setView("div")}>ディビジョン</button>
          </div>
        }
      />
      <p className="muted" style={{ fontSize: 14, margin: "0 0 16px", lineHeight: 1.7 }}>
        順位はカンファレンスごとの勝率で決定。同率はNBAのタイブレーク規定（直接対決→ディビジョン優勝→カンファレンス内成績…）に準拠します。
        <br />
        <ClinchLegend />
      </p>
      {view === "conf"
        ? CONFS().map((c) => <ConferenceStandings key={c.key} conf={c} />)
        : CONFS().map((c) => <DivisionStandings key={c.key} conf={c} />)}
      {po.note ? <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>{po.note}</p> : null}
    </div>
  );
}

/* ---- POSTSEASON ---- */
function Matchup({ s }) {
  const st = s || {};
  const aw = st.as > st.bs, bw = st.bs > st.as;
  return (
    <div className="matchup">
      <div className={"mu-team" + (aw ? " win" : "")}>
        {st.sa ? <span className="mu-seed">#{st.sa}</span> : null}
        <Badge abbr={st.a} /><span className="mu-name">{team(st.a).name}</span><span className="mu-score mono">{st.as}</span>
      </div>
      <div className={"mu-team" + (bw ? " win" : "")}>
        {st.sb ? <span className="mu-seed">#{st.sb}</span> : null}
        <Badge abbr={st.b} /><span className="mu-name">{team(st.b).name}</span><span className="mu-score mono">{st.bs}</span>
      </div>
    </div>
  );
}
function GameLog({ s }) {
  return (
    <div className="gamelog">
      {((s && s.games) || []).map((g, i) => {
        const a = Array.isArray(g) ? g[0] : g.a;
        const b = Array.isArray(g) ? g[1] : g.b;
        const aw = a > b;
        return (
          <div key={i} className="game-pill">
            <span className="gnum">GAME {i + 1}</span>
            <span className="gsc">
              <span style={{ color: aw ? "var(--accent)" : "var(--muted)" }}>{a}</span>
              <span className="muted"> – </span>
              <span style={{ color: !aw ? "var(--accent)" : "var(--muted)" }}>{b}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
function SeriesCard({ s, round, major, compact }) {
  const st = s || {};
  const aw = st.as > st.bs;
  return (
    <div className={"series-card" + (major ? " major" : "")}>
      <div className="series-head">
        <span className="series-round">{round}</span>
        <span className="series-format">{st.format || PLAYOFF().seriesFormat || ""}</span>
      </div>
      <div className="series-line">
        <span className={"series-team" + (aw ? " winner" : "")}>
          {st.sa ? <span className="mu-seed">#{st.sa}</span> : null}
          <Badge abbr={st.a} /><span className="nm">{team(st.a).name}</span>
        </span>
        <span className="series-vs">{st.as} <span className="muted">–</span> {st.bs}</span>
        <span className={"series-team" + (!aw ? " winner" : "")}>
          {st.sb ? <span className="mu-seed">#{st.sb}</span> : null}
          <Badge abbr={st.b} /><span className="nm">{team(st.b).name}</span>
        </span>
      </div>
      {!compact && <GameLog s={st} />}
      <div className="series-meta">
        {!compact && (st.mvp ? <span className="meta-chip mvp">シリーズMVP <Badge abbr={st.mvp.t} /> <b>{st.mvp.p}</b></span>
          : st.standout ? <span className="meta-chip">注目選手 <Badge abbr={st.standout.t} /> <b>{st.standout.p}</b></span> : null)}
        {st.a || st.b ? <span className="meta-chip">勝者 <Badge abbr={aw ? st.a : st.b} /></span> : null}
      </div>
      {st.note ? <div className="series-note">{st.note}</div> : null}
    </div>
  );
}

// プレーオフ方式の説明（レギュレーションの数値をそのまま表示）
function PlayoffFormatNote() {
  const po = PLAYOFF();
  const rounds = po.rounds || [];
  return (
    <p className="muted" style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>
      各カンファレンス{po.berths ?? 8}クラブ・計{(po.berths ?? 8) * CONFS().length}クラブが出場。
      1〜{po.directBerths ?? 6}位は本戦へ直接進出、{po.playInStart ?? 7}〜{po.playInEnd ?? 10}位はプレイイントーナメント。
      {rounds.length ? "本戦は " + rounds.map((r) => r.label).join(" → ") + " → ファイナル（すべて" + (po.seriesFormat || "7戦4勝制") + "）。" : ""}
      {po.homeCourt ? "ホームコートアドバンテージは上位シードが保持（" + po.homeCourt + "）。" : ""}
    </p>
  );
}

// プレイイントーナメント（すべて1試合制）
function PlayInBlock({ conf }) {
  const po = PLAYOFF();
  const s = po.playInStart ?? 7;
  const e = po.playInEnd ?? 10;
  const games = (DATA.postseason && DATA.postseason.conferences && DATA.postseason.conferences[conf.key] && DATA.postseason.conferences[conf.key].playIn) || [];
  const steps = [
    { label: "第1ラウンドA（" + s + "位 対 " + (s + 1) + "位）", hint: "勝者が第" + s + "シード" },
    { label: "第1ラウンドB（" + (e - 1) + "位 対 " + e + "位）", hint: "敗者は敗退" },
    { label: "第2ラウンド（Aの敗者 対 Bの勝者）", hint: "勝者が第" + (s + 1) + "シード" },
  ];
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-head">
        <span className="kicker" style={{ color: confColor(conf.key) }}>{conf.label || conf.name} · Play-In</span>
        <span className="muted" style={{ fontSize: 14 }}>1試合制／上位クラブの本拠地開催</span>
      </div>
      <div className="card-body">
        {steps.map((st, i) => (
          <div key={i} style={{ marginBottom: i < steps.length - 1 ? 16 : 0 }}>
            <div className="round-label">{st.label} — {st.hint}</div>
            {games[i] ? <Matchup s={games[i]} /> : <div className="muted" style={{ fontSize: 14 }}>結果は未登録です。</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// カンファレンス・ブラケット（ラウンド構成は DATA.league.playoff.rounds から）
function ConferenceBracket({ conf }) {
  const rounds = PLAYOFF().rounds || [];
  const psc = (DATA.postseason && DATA.postseason.conferences) || {};
  const data = (psc[conf.key] && psc[conf.key].rounds) || {};
  return (
    <div className="card">
      <div className="card-head">
        <span className="kicker" style={{ color: confColor(conf.key) }}>{conf.label || conf.name}</span>
      </div>
      <div className="card-body">
        <div className="bracket">
          {rounds.map((r) => {
            const list = data[r.key] || [];
            return (
              <div className="round" key={r.key}>
                <div className="round-label">{r.label}</div>
                {list.length
                  ? list.map((m, i) => <Matchup key={i} s={m} />)
                  : <div className="muted" style={{ fontSize: 14 }}>未登録</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ファイナル（カンファレンス王者同士）
function FinalsHero() {
  const f = (DATA.postseason && DATA.postseason.finals) || {};
  if (!f.champ) {
    return (
      <div className="card"><div className="card-body">
        <div className="kicker">Finals</div>
        <p className="muted" style={{ fontSize: 16, margin: "8px 0 0" }}>ファイナルの結果は未登録です。</p>
      </div></div>
    );
  }
  const champ = team(f.champ);
  return (
    <div className="ws-champion">
      <div className="ws-tag">{seasonLabel(DATA.season)} Bプレミア ファイナル</div>
      <div className="ws-trophy">🏆</div>
      <div className="ws-headline">Champion</div>
      <div className="ws-champ-name">{champ.name}</div>
      <div className="ws-result">
        <TeamCell abbr={f.a} /><span className="vs-score">{f.as} — {f.bs}</span><TeamCell abbr={f.b} />
      </div>
      {f.mvp && f.mvp.p ? (
        <div className="ws-mvp"><span className="lbl">Finals MVP</span><Badge abbr={f.mvp.t} /><b>{f.mvp.p}</b></div>
      ) : null}
      {(f.path || []).length ? (
        <div className="ws-path">
          {f.path.map((p, i) => <span key={i} className="step">{p.r} <b>vs {team(p.op).abbr}</b> {p.res}</span>)}
        </div>
      ) : null}
    </div>
  );
}

// NBAカップ（インシーズン・トーナメント）
function CupBlock() {
  const c = (DATA.postseason && DATA.postseason.cup) || null;
  if (!c) return null;
  return (
    <div className="card">
      <div className="card-head">
        <span className="kicker">{c.name || "NBAカップ"}</span>
        <span className="muted" style={{ fontSize: 14 }}>インシーズン・トーナメント</span>
      </div>
      <div className="card-body">
        {c.champ ? (
          <div className="series-line" style={{ padding: 0, marginBottom: 12 }}>
            <span className="series-team winner"><Badge abbr={c.champ} /><span className="nm">{team(c.champ).name}</span></span>
            <span className="series-vs">{c.finalScore || ""}</span>
            {c.runnerUp ? <span className="series-team"><Badge abbr={c.runnerUp} /><span className="nm">{team(c.runnerUp).name}</span></span> : null}
          </div>
        ) : null}
        <div className="series-meta" style={{ padding: 0 }}>
          {c.champ ? <span className="meta-chip">優勝 <Badge abbr={c.champ} /> <b>{team(c.champ).name}</b></span> : null}
          {c.mvp && c.mvp.p ? <span className="meta-chip mvp">大会MVP {c.mvp.t ? <Badge abbr={c.mvp.t} /> : null} <b>{c.mvp.p}</b></span> : null}
        </div>
        {c.note ? <div className="series-note" style={{ padding: "12px 0 0" }}>{c.note}</div> : null}
      </div>
    </div>
  );
}

function PostseasonRecap() {
  const r = (DATA.postseason && DATA.postseason.recap) || { headline: "", body: [], moments: [] };
  if (!r.headline && !(r.body || []).length) {
    return <div className="card"><div className="card-body"><p className="muted" style={{ fontSize: 16, margin: 0 }}>総括は未登録です。</p></div></div>;
  }
  return (
    <div className="recap">
      <h3>{r.headline}</h3>
      {(r.body || []).map((p, i) => <p key={i}>{p}</p>)}
      {(r.moments || []).length ? (
        <div style={{ marginTop: 8 }}>
          <div className="kicker" style={{ marginBottom: 4 }}>Key Moments</div>
          {r.moments.map((m, i) => (
            <div className="moment" key={i}>
              <span className="mk">{m.k}</span>
              <div><div className="mt">{m.t}</div><div className="mb">{m.b}</div></div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
function PhotoStrip({ group, min = 180, ratio = "4/3" }) {
  const photos = (DATA.postseason && DATA.postseason.gallery && DATA.postseason.gallery[group]) || [];
  const norm = photos
    .map((p) => (typeof p === "string" ? { url: p } : p))
    .filter((p) => p && p.url);
  if (norm.length === 0) return null;
  return (
    <div className="gallery-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(" + min + "px, 1fr))" }}>
      {norm.map((p, i) => (
        <a key={i} className="photo-slot" style={{ aspectRatio: ratio }} href={p.url} target="_blank" rel="noreferrer">
          <img src={p.url} alt={p.caption || group} loading="lazy" />
          {p.caption ? <div className="photo-cap">{p.caption}</div> : null}
        </a>
      ))}
    </div>
  );
}
function PostseasonPage() {
  const rounds = PLAYOFF().rounds || [];
  const psc = (DATA.postseason && DATA.postseason.conferences) || {};
  return (
    <div>
      <SectionHead kicker="Postseason" title="ポストシーズン" />
      <PlayoffFormatNote />
      <FinalsHero />

      <SectionHead kicker="In-Season Tournament" title="NBAカップ" />
      <CupBlock />

      <SectionHead kicker="Play-In" title="プレイイントーナメント" />
      <div className="grid g2">{CONFS().map((c) => <PlayInBlock key={c.key} conf={c} />)}</div>

      <SectionHead kicker="Bracket" title="プレーオフ・ブラケット" />
      <div className="grid g2">{CONFS().map((c) => <ConferenceBracket key={c.key} conf={c} />)}</div>

      <div className="kicker" style={{ margin: "18px 0 10px" }}>Highlights</div>
      <PhotoStrip group="hero" min={300} ratio="16/9" />

      <SectionHead kicker="Series Detail" title="対戦カード詳細" />
      {CONFS().map((c) => {
        const data = (psc[c.key] && psc[c.key].rounds) || {};
        const any = rounds.some((r) => (data[r.key] || []).length);
        return (
          <div key={c.key}>
            <div className="kicker" style={{ color: confColor(c.key), margin: "8px 0 12px" }}>{c.label || c.name}</div>
            {any
              ? rounds.slice().reverse().map((r) => (
                  <div key={r.key} className="grid g2">
                    {(data[r.key] || []).map((m, i) => (
                      <SeriesCard key={r.key + i} s={m} round={r.label} major={r.key === "confFinals"} />
                    ))}
                  </div>
                ))
              : <p className="muted" style={{ fontSize: 14 }}>対戦結果は未登録です。</p>}
          </div>
        );
      })}

      <div className="kicker" style={{ margin: "6px 0 10px" }}>Series Photos</div>
      <PhotoStrip group="series" min={170} ratio="4/3" />

      <SectionHead kicker="Recap" title="ポストシーズン総括" />
      <PostseasonRecap />

      <div className="kicker" style={{ margin: "18px 0 10px" }}>Scene Gallery</div>
      <PhotoStrip group="recap" min={220} ratio="4/3" />
    </div>
  );
}

/* ---- PROSPECTS ---- */
function ProspectsPage() {
  return (
    <div>
      <SectionHead kicker="Prospects" title="若手有望株ランキング" right={<span className="muted" style={{ fontSize: 14 }}>FV = Future Value 評価</span>} />
      {DATA.prospects.map((p) => (
        <div className="prospect" key={p.rank}>
          <div className="pr-rank">{p.rank}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span className="display" style={{ fontSize: 17, fontWeight: 700 }}>{p.name}</span>
              <Badge abbr={p.team} /><span className="tag">{p.pos}</span><span className="tag">{p.age}歳</span><span className="tag">ETA {p.eta}</span>
            </div>
            <div className="muted" style={{ fontSize: 14.5, marginTop: 6 }}>{p.note}</div>
          </div>
          <div className="pr-grade">{p.grade} FV</div>
        </div>
      ))}
    </div>
  );
}

/* ---- AWARDS ---- */
const MEDALS = ["🥇", "🥈", "🥉"];

// 個人成績の指標表示。列と並び順は league.statKeys の定義に従う（増やせば自動で増える）
const STAT_KEYS = () => (LEAGUE().statKeys || []);
function StatLine({ stats }) {
  const keys = STAT_KEYS().filter((k) => stats && stats[k.key] != null && stats[k.key] !== "");
  if (!keys.length) return null;
  return (
    <div className="statline">
      {keys.map((k) => (
        <span className="statline-item" key={k.key} title={k.hint || k.label}>
          <span className="statline-label">{k.label}</span>
          <span className="statline-val mono">{stats[k.key]}</span>
        </span>
      ))}
    </div>
  );
}

// 未登録の枠を示す共通表示
function Pending({ text = "未登録です。CMSのシーズン編集から登録できます。" }) {
  return <p className="muted" style={{ fontSize: 14, margin: 0, lineHeight: 1.7 }}>{text}</p>;
}

// 投票アワード（リーグ全体。1〜3位を表彰台で表示）
function VotingAward({ award }) {
  const list = award.finalists || [];
  return (
    <div className="award-block">
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <span className="award-name">{award.label}</span>
        {award.note ? <span className="muted" style={{ fontSize: 14 }}>{award.note}</span> : null}
      </div>
      {list.length ? (
        <div className="podium">
          {list.map((f, i) => (
            <div key={i} className={"finalist" + (i === 0 ? " first" : "")}>
              <div className="place"><span className="medal">{MEDALS[i]}</span>{i + 1}位</div>
              <div className="player">{f.p}</div>
              {f.t ? (
                <div style={{ marginBottom: 6 }}>
                  <Badge abbr={f.t} /> <span className="muted" style={{ fontSize: 14 }}>{team(f.t).name}</span>
                </div>
              ) : null}
              {f.line ? <div className="stats">{f.line}</div> : null}
              <StatLine stats={f.stats} />
              {f.pts != null || f.first != null ? (
                <div className="points-row">
                  <span className="points-val mono">{f.pts ?? "—"}</span>
                  <span className="points-label">得票ポイント</span>
                  {f.first ? <span className="points-label" style={{ marginLeft: "auto" }}>1位票 {f.first}</span> : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="card"><div className="card-body"><Pending /></div></div>
      )}
    </div>
  );
}
function VotingTab() {
  const list = (DATA.awards && DATA.awards.voting) || [];
  if (!list.length) return <div className="card"><div className="card-body"><Pending text="表彰の枠が未定義です。" /></div></div>;
  return <div>{list.map((a) => <VotingAward key={a.key} award={a} />)}</div>;
}

// オール◯◯チーム（1st/2nd/3rd）
function AllTeamsTab() {
  const groups = (DATA.awards && DATA.awards.allTeams) || [];
  if (!groups.length) return <div className="card"><div className="card-body"><Pending /></div></div>;
  return (
    <div>
      {groups.map((g) => (
        <div className="award-block" key={g.key}>
          <div style={{ marginBottom: 10 }}><span className="award-name">{g.label}</span></div>
          <div className="grid g3">
            {(g.tiers || []).map((t) => (
              <div className="card" key={t.tier}>
                <div className="card-head">
                  <span className="kicker">{t.tier} TEAM</span>
                  <span className="muted" style={{ fontSize: 14 }}>{(t.members || []).length} 名</span>
                </div>
                <div className="card-body">
                  {(t.members || []).length ? (
                    <div className="table-scroll"><table>
                      <thead><tr><th>選手</th><th>POS</th><th>クラブ</th><th>成績</th></tr></thead>
                      <tbody>
                        {t.members.map((m, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 700 }}>{m.p}</td>
                            <td className="muted">{m.pos || "—"}</td>
                            <td style={{ whiteSpace: "nowrap" }}>{m.t ? <TeamCell abbr={m.t} /> : <span className="muted">—</span>}</td>
                            <td><StatLine stats={m.stats} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table></div>
                  ) : <Pending />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// スタッツタイトル（1試合平均・成功率）
function StatTitlesTab() {
  const list = (DATA.awards && DATA.awards.statTitles) || [];
  if (!list.length) return <div className="card"><div className="card-body"><Pending /></div></div>;
  return (
    <div className="grid g2">
      {list.map((s) => (
        <div className="card" key={s.key}>
          <div className="card-head">
            <span className="kicker">{s.label}</span>
            <span className="muted" style={{ fontSize: 14 }}>{s.unit}</span>
          </div>
          <div className="card-body">
            {(s.leaders || []).length ? (
              <div className="table-scroll"><table>
                <tbody>
                  {s.leaders.map((r, i) => (
                    <tr key={i}>
                      <td className="rank-cell">{i + 1}</td>
                      <td><Player name={r.p} t={r.t} /></td>
                      <td className="num mono" style={{ fontWeight: 700, color: i === 0 ? "var(--accent)" : "var(--text)" }}>{r.v}</td>
                      <td><StatLine stats={r.stats} /></td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            ) : <Pending />}
            {s.note ? <p className="muted" style={{ fontSize: 14, margin: "12px 0 0", lineHeight: 1.7 }}>{s.note}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

// 月間・週間表彰（東西各1人）
function PeriodicTab() {
  const a = DATA.awards || {};
  const monthly = a.monthly || [];
  const weekly = a.weekly || [];
  const Block = ({ title, rows, cols }) => (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-head">
        <span className="kicker">{title}</span>
        <span className="muted" style={{ fontSize: 14 }}>{rows.length} 件</span>
      </div>
      <div className="card-body">
        {rows.length ? (
          <div className="table-scroll"><table>
            <thead><tr>
              <th>期間</th><th>カンファレンス</th>
              {cols.map((c) => <th key={c.key}>{c.label}</th>)}
            </tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="mono">{r.period || "—"}</td>
                  <td className="muted">{r.conf || "—"}</td>
                  {cols.map((c) => (
                    <td key={c.key}>{r[c.key] && r[c.key].p ? <Player name={r[c.key].p} t={r[c.key].t} /> : <span className="muted">—</span>}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : <Pending />}
      </div>
    </div>
  );
  return (
    <div>
      <Block title="月間表彰" rows={monthly} cols={[{ key: "mvp", label: "月間MVP" }, { key: "rookie", label: "月間最優秀新人" }]} />
      <Block title="週間表彰" rows={weekly} cols={[{ key: "mvp", label: "週間MVP" }]} />
    </div>
  );
}

// オールスター（ロスター／本戦／関連イベント）
function AllStarTab() {
  const as = (DATA.awards && DATA.awards.allStar) || null;
  if (!as) return <div className="card"><div className="card-body"><Pending /></div></div>;
  const Roster = ({ r }) => (
    <div className="card">
      <div className="card-head"><span className="kicker">{r.team}</span></div>
      <div className="card-body">
        {["frontcourt", "backcourt"].map((k) => {
          const list = r[k] || [];
          return (
            <div key={k} style={{ marginBottom: 12 }}>
              <div className="round-label">{k === "frontcourt" ? "フロントコート" : "バックコート"}</div>
              {list.length
                ? list.map((m, i) => <div key={i} style={{ padding: "4px 0" }}><Player name={m.p} t={m.t} /></div>)
                : <Pending text="選出は未登録です。" />}
            </div>
          );
        })}
      </div>
    </div>
  );
  return (
    <div>
      {as.note ? <p className="muted" style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>{as.note}</p> : null}
      <div className="grid g2">{(as.rosters || []).map((r, i) => <Roster key={i} r={r} />)}</div>
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-head"><span className="kicker">本戦・関連イベント</span></div>
        <div className="card-body">
          <div className="series-meta" style={{ padding: 0 }}>
            {as.result ? <span className="meta-chip">結果 <b>{as.result}</b></span> : null}
            {as.mvp && as.mvp.p ? <span className="meta-chip mvp">MVP {as.mvp.t ? <Badge abbr={as.mvp.t} /> : null} <b>{as.mvp.p}</b></span> : null}
            {(as.events || []).map((e, i) => (
              <span className="meta-chip" key={i}>
                {e.name} {e.winner && e.winner.p ? <><Badge abbr={e.winner.t} /> <b>{e.winner.p}</b></> : <span className="muted">未登録</span>}
              </span>
            ))}
          </div>
          {!as.result && !(as.mvp && as.mvp.p) ? <div style={{ marginTop: 10 }}><Pending /></div> : null}
        </div>
      </div>
    </div>
  );
}

// ポストシーズンMVP（カンファレンス決勝・ファイナル）
function PostseasonMvpTab() {
  const list = (DATA.awards && DATA.awards.postseasonMvp) || [];
  if (!list.length) return <div className="card"><div className="card-body"><Pending /></div></div>;
  const Card = ({ m, big }) => (
    <div className="mvp-hero" style={big ? { borderLeftColor: "var(--gold-dim)" } : undefined}>
      <div className="label" style={big ? { color: "var(--gold)" } : undefined}>{big ? "🏆 " : ""}{m.label}</div>
      {m.p ? (
        <>
          <div className="player" style={big ? { fontSize: 32 } : undefined}>{m.p}</div>
          {m.t ? <div style={{ marginBottom: 6 }}><Badge abbr={m.t} /> <span className="muted" style={{ fontSize: 14 }}>{team(m.t).name}</span></div> : null}
          {m.line ? <div className="line">{m.line}</div> : null}
          <StatLine stats={m.stats} />
        </>
      ) : <div style={{ marginTop: 8 }}><Pending /></div>}
    </div>
  );
  return (
    <div>
      <div className="grid g2" style={{ marginBottom: 16 }}>
        {list.filter((m) => !m.big).map((m) => <Card key={m.key} m={m} />)}
      </div>
      {list.filter((m) => m.big).map((m) => <Card key={m.key} m={m} big />)}
    </div>
  );
}

const AWARD_TABS = [
  { id: "voting",   label: "シーズンアワード" },
  { id: "allteams", label: "オールチーム" },
  { id: "stats",    label: "スタッツタイトル" },
  { id: "periodic", label: "月間・週間" },
  { id: "allstar",  label: "オールスター" },
  { id: "psmvp",    label: "ポストシーズンMVP" },
];
function AwardsPage() {
  const [tab, setTab] = useState("voting");
  return (
    <div>
      <SectionHead
        kicker="Awards"
        title="表彰・タイトル"
        right={<span className="muted" style={{ fontSize: 14, maxWidth: 360, textAlign: "right" }}>Bプレミア レギュレーション準拠。投票アワードはシーズン終了後に決定</span>}
      />
      <div className="subtabs">
        {AWARD_TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {tab === "voting" && <VotingTab />}
      {tab === "allteams" && <AllTeamsTab />}
      {tab === "stats" && <StatTitlesTab />}
      {tab === "periodic" && <PeriodicTab />}
      {tab === "allstar" && <AllStarTab />}
      {tab === "psmvp" && <PostseasonMvpTab />}
    </div>
  );
}

/* ---- NEWS（記事一覧 / 記事詳細） ---- */
function ArticleCard({ a, onOpen }) {
  return (
    <div className="article-card" onClick={() => onOpen(a.id)}>
      <div className="thumb" style={thumbBg(a)} />
      <div className="body">
        <div className="article-meta">
          <span className="hero-cat" style={{ marginBottom: 0 }}>{a.cat}</span>
          <span className="muted mono">{a.date}</span>
        </div>
        <div className="title">{a.title}</div>
        <div className="excerpt">{a.excerpt}</div>
      </div>
    </div>
  );
}
function ArticleDetail({ a, onBack }) {
  if (!a) return null;
  // ヒーローに使った画像はギャラリーから除いて重複表示を防ぐ。
  const gallery = (a.photoUrls || []).filter((u) => u !== a.thumbnailUrl);
  return (
    <div>
      <button className="back-btn" onClick={onBack}>← 記事一覧へ</button>
      {a.thumbnailUrl ? (
        <>
          {/* 画像記事：見出しを上に置き、写真はトリミングせず全体表示 */}
          <header className="article-head">
            <span className="hero-cat">{a.cat}</span>
            <h1 className="article-headline">{a.title}</h1>
            <div className="muted mono" style={{ fontSize: 14 }}>{a.date}</div>
          </header>
          <img className="article-hero-img" src={a.thumbnailUrl} alt={a.title} />
        </>
      ) : (
        <div className="article-detail-hero" style={{ marginTop: 12 }}>
          <div className="hero-bg" style={thumbBg(a)} />
          <div className="hero-grad" />
          <div className="hero-content">
            <span className="hero-cat">{a.cat}</span>
            <h1 className="hero-title" style={{ fontSize: 26 }}>{a.title}</h1>
            <div className="muted mono" style={{ fontSize: 14 }}>{a.date}</div>
          </div>
        </div>
      )}
      <div className="article-detail-body" style={{ marginTop: 18 }}>
        {(a.body || [a.excerpt]).map((line, i) => renderArticleBlock(line, i))}
      </div>
      {gallery.length > 0 && (
        <div className="article-photos">
          {gallery.map((u, i) => (
            <a key={i} href={u} target="_blank" rel="noreferrer">
              <img src={u} alt={`${a.title} photo ${i + 1}`} loading="lazy" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
function NewsPage({ articleId, setArticleId }) {
  const sorted = sortedArticles();
  if (articleId) {
    const a = sorted.find((x) => x.id === articleId);
    return <ArticleDetail a={a} onBack={() => setArticleId(null)} />;
  }
  return (
    <div>
      <SectionHead kicker="News" title="記事一覧" right={<span className="muted" style={{ fontSize: 14 }}>{sorted.length} 件 · 新しい順</span>} />
      <div className="article-grid">
        {sorted.map((a) => <ArticleCard key={a.id} a={a} onOpen={setArticleId} />)}
      </div>
    </div>
  );
}

/* ---- STATS（選手成績 / クラブ成績 / リーグリーダー） ---- */
const PLAYER_STAT_KEYS = () => (LEAGUE().playerStatKeys || LEAGUE().statKeys || []);
const TEAM_STAT_KEYS = () => (LEAGUE().teamStatKeys || []);

// 列ヘッダをクリックして並び替えできる成績表
function SortableStatTable({ rows, cols, nameCol, defaultSort, extraCols }) {
  const [sortKey, setSortKey] = useState(defaultSort || (cols[0] && cols[0].key));
  const [desc, setDesc] = useState(true);
  const val = (r, k) => {
    if (r.stats && r.stats[k] != null) return r.stats[k];
    if (r[k] != null) return r[k];
    return null;
  };
  const sorted = [...rows].sort((a, b) => {
    const x = val(a, sortKey), y = val(b, sortKey);
    if (x == null && y == null) return 0;
    if (x == null) return 1;
    if (y == null) return -1;
    const nx = typeof x === "number" ? x : parseFloat(x);
    const ny = typeof y === "number" ? y : parseFloat(y);
    if (!isNaN(nx) && !isNaN(ny)) return desc ? ny - nx : nx - ny;
    return desc ? String(y).localeCompare(String(x)) : String(x).localeCompare(String(y));
  });
  const click = (k) => {
    if (k === sortKey) setDesc((v) => !v);
    else { setSortKey(k); setDesc(true); }
  };
  const arrow = (k) => (k === sortKey ? (desc ? " ▾" : " ▴") : "");
  return (
    <div className="table-scroll"><table>
      <thead><tr>
        <th className="num">#</th>
        <th>{nameCol || "選手"}</th>
        {(extraCols || []).map((c) => <th key={c.key}>{c.label}</th>)}
        {cols.map((c) => (
          <th key={c.key} className="num sortable" title={c.hint || c.label} onClick={() => click(c.key)}>
            {c.label}{arrow(c.key)}
          </th>
        ))}
      </tr></thead>
      <tbody>
        {sorted.map((r, i) => (
          <tr key={(r.p || r.team) + i}>
            <td className="rank-cell">{i + 1}</td>
            <td style={{ whiteSpace: "nowrap" }}>
              {r.p ? <Player name={r.p} t={r.t} /> : <TeamCell abbr={r.team} full />}
            </td>
            {(extraCols || []).map((c) => <td key={c.key} className="muted">{r[c.key] == null || r[c.key] === "" ? "—" : String(r[c.key])}</td>)}
            {cols.map((c) => {
              const v = val(r, c.key);
              return <td key={c.key} className="num mono">{v == null || v === "" ? "—" : v}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table></div>
  );
}

// 選手成績（ルーキー絞り込み・クラブ絞り込み付き）
function PlayerStatsTab() {
  const all = DATA.playerSeasonStats || [];
  const [rookieOnly, setRookieOnly] = useState(false);
  const [teamFilter, setTeamFilter] = useState("");
  if (!all.length) return <div className="card"><div className="card-body"><Pending /></div></div>;
  const teamsWith = [...new Set(all.map((r) => r.t).filter(Boolean))];
  const rows = all
    .filter((r) => (rookieOnly ? r.rookie : true))
    .filter((r) => (teamFilter ? r.t === teamFilter : true));
  return (
    <div>
      <div className="stats-controls">
        <div className="toggle">
          <button className={!rookieOnly ? "on acc" : ""} onClick={() => setRookieOnly(false)}>全選手</button>
          <button className={rookieOnly ? "on acc" : ""} onClick={() => setRookieOnly(true)}>ルーキーのみ</button>
        </div>
        <label className="stats-select">
          <span className="muted">クラブ</span>
          <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
            <option value="">すべて</option>
            {teamsWith.map((a) => <option key={a} value={a}>{team(a).name}</option>)}
          </select>
        </label>
        <span className="muted" style={{ fontSize: 14 }}>{rows.length} 名 · 列見出しをタップで並び替え</span>
      </div>
      <div className="card">
        <SortableStatTable
          rows={rows}
          cols={PLAYER_STAT_KEYS()}
          nameCol="選手"
          defaultSort="ppg"
          extraCols={[{ key: "pos", label: "POS" }]}
        />
      </div>
    </div>
  );
}

// クラブ成績
function TeamStatsTab() {
  const rows = DATA.teamSeasonStats || [];
  if (!rows.length) return <div className="card"><div className="card-body"><Pending /></div></div>;
  return (
    <div>
      <p className="muted" style={{ fontSize: 14, margin: "0 0 12px" }}>列見出しをタップで並び替えできます。</p>
      <div className="card">
        <SortableStatTable
          rows={rows}
          cols={TEAM_STAT_KEYS()}
          nameCol="クラブ"
          defaultSort="ppg"
          extraCols={[{ key: "gp", label: "GP" }, { key: "w", label: "W" }, { key: "l", label: "L" }]}
        />
      </div>
    </div>
  );
}

// リーグリーダー（部門別の上位）
function LeagueLeadersTab() {
  const ll = DATA.leagueLeaders;
  const groups = (ll && ll.groups) || [];
  if (!groups.length) return <div className="card"><div className="card-body"><Pending /></div></div>;
  return (
    <div>
      {ll.note ? <p className="muted" style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>{ll.note}</p> : null}
      {groups.map((g) => (
        <div key={g.key} style={{ marginBottom: 24 }}>
          <div className="kicker" style={{ margin: "8px 0 12px" }}>{g.label}</div>
          <div className="grid g2">
            {(g.categories || []).map((c) => (
              <div className="card" key={c.key}>
                <div className="card-head">
                  <span className="kicker">{c.label}</span>
                  <span className="muted" style={{ fontSize: 14 }}>{c.unit || ""}</span>
                </div>
                <div className="card-body">
                  {(c.rows || []).length ? (
                    <div className="table-scroll"><table>
                      <tbody>
                        {c.rows.map((r, i) => (
                          <tr key={i}>
                            <td className="rank-cell">{r.rank == null ? i + 1 : r.rank}</td>
                            <td><Player name={r.p} t={r.t} /></td>
                            <td className="num mono" style={{ fontWeight: 700, color: i === 0 ? "var(--accent)" : "var(--text)" }}>{r.v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table></div>
                  ) : <Pending />}
                  {c.note ? <p className="muted" style={{ fontSize: 14, margin: "12px 0 0" }}>{c.note}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const STATS_TABS = [
  { id: "players", label: "選手成績" },
  { id: "teams", label: "クラブ成績" },
  { id: "leaders", label: "リーグリーダー" },
];
function StatsPage() {
  const [tab, setTab] = useState("players");
  const np = (DATA.playerSeasonStats || []).length;
  const nt = (DATA.teamSeasonStats || []).length;
  return (
    <div>
      <SectionHead
        kicker="Stats"
        title="成績"
        right={<span className="muted" style={{ fontSize: 14 }}>選手 {np} 名 / クラブ {nt}</span>}
      />
      <div className="subtabs">
        {STATS_TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {tab === "players" && <PlayerStatsTab />}
      {tab === "teams" && <TeamStatsTab />}
      {tab === "leaders" && <LeagueLeadersTab />}
    </div>
  );
}

/* ---- DRAFT ---- */
function DraftPickTable({ picks, title, note }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="card-head">
        <span className="kicker">{title}</span>
        <span className="muted" style={{ fontSize: 14 }}>{picks.length} 件</span>
      </div>
      <div className="card-body">
        {picks.length ? (
          <div className="table-scroll"><table>
            <thead><tr>
              <th className="num">巡</th>
              <th className="num">指名</th>
              <th className="num">全体</th>
              <th>クラブ</th>
              <th>選手</th>
              <th>POS</th>
              <th>出身</th>
            </tr></thead>
            <tbody>
              {picks.map((pk, i) => (
                <tr key={i}>
                  <td className="num mono">{pk.round == null ? "—" : pk.round}</td>
                  <td className="num mono">{pk.pick == null ? "—" : pk.pick}</td>
                  <td className="num mono" style={{ fontWeight: 700 }}>{pk.overall == null ? "—" : pk.overall}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{pk.team ? <TeamCell abbr={pk.team} /> : <span className="muted">—</span>}</td>
                  <td style={{ fontWeight: 700 }}>{pk.p || "—"}</td>
                  <td className="muted">{pk.pos || "—"}</td>
                  <td className="muted">{pk.from || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        ) : <Pending />}
        {note ? <p className="muted" style={{ fontSize: 14, margin: "12px 0 0", lineHeight: 1.7 }}>{note}</p> : null}
      </div>
    </div>
  );
}
function DraftPage() {
  const dr = DATA.draft || {};
  const lottery = dr.lottery || [];
  const exp = dr.expansion || {};
  return (
    <div>
      <SectionHead
        kicker="Draft"
        title={dr.name || "ドラフト"}
        right={<span className="muted" style={{ fontSize: 14 }}>巡・指名順・全体順位・クラブ</span>}
      />
      {dr.note ? <p className="muted" style={{ fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>{dr.note}</p> : null}

      {lottery.length ? (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-head">
            <span className="kicker">Lottery · 指名順抽選</span>
            <span className="muted" style={{ fontSize: 14 }}>{lottery.length} クラブ</span>
          </div>
          <div className="card-body">
            <div className="series-meta" style={{ padding: 0 }}>
              {lottery.map((x, i) => (
                <span className="meta-chip" key={i}>
                  <b>{x.order == null ? i + 1 : x.order}</b> {x.team ? <TeamCell abbr={x.team} /> : <span className="muted">—</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <DraftPickTable picks={dr.picks || []} title="新人ドラフト 指名結果" />

      <SectionHead kicker="Expansion Draft" title={exp.name || "拡張ドラフト"} />
      <DraftPickTable picks={exp.picks || []} title="拡張ドラフト 指名結果" note={exp.note} />
    </div>
  );
}

/* ---- TEAMS（クラブ一覧 / クラブ詳細） ---- */
// abbr からカンファレンス順位表の行を引く（カンファレンス構成はデータ由来）。
function findStanding(abbr) {
  for (const c of CONFS()) {
    const rows = confRows(c.key);
    const idx = rows.findIndex((r) => team(r.team).abbr === team(abbr).abbr);
    if (idx >= 0) return { ...rows[idx], conf: c, rank: idx + 1 };
  }
  return null;
}

function TeamRow({ abbr, onOpen }) {
  const t = team(abbr);
  const s = findStanding(abbr);
  return (
    <div
      onClick={() => onOpen(abbr)}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
        cursor: "pointer", borderTop: "1px solid rgba(0,0,0,.08)",
      }}
    >
      {s ? <span className="rank-cell mono" style={{ width: 28 }}>{s.rank}</span> : null}
      <Badge abbr={abbr} />
      <span style={{ fontWeight: 700, flex: 1, minWidth: 0 }}>{t.name}</span>
      {s ? <span className="mono muted" style={{ fontSize: 14 }}>{s.w}-{s.l}</span> : null}
    </div>
  );
}

function TeamsPage({ onOpen }) {
  const total = CONFS().reduce((a, c) => a + confRows(c.key).length, 0);
  return (
    <div>
      <SectionHead kicker="Teams" title="クラブ一覧"
        right={<span className="muted" style={{ fontSize: 14 }}>{total} クラブ／クラブをクリックで詳細</span>} />
      {CONFS().map((c) => {
        const divs = c.divisions && c.divisions.length ? c.divisions : [{ key: null, name: c.name }];
        return (
          <div key={c.key}>
            <div className="kicker" style={{ color: confColor(c.key), margin: "16px 0 10px" }}>
              {c.name}（{confRows(c.key).length} クラブ）
            </div>
            <div className="grid g2">
              {divs.map((d) => {
                const list = teamsInDivision(c.key, d.key);
                return (
                  <div className="card" key={d.key || "all"}>
                    <div className="card-head">
                      <span className="kicker" style={{ color: confColor(c.key) }}>{d.name}・ディビジョン</span>
                      <span className="muted" style={{ fontSize: 14 }}>{list.length} クラブ</span>
                    </div>
                    <div style={{ padding: "2px 0 6px" }}>
                      {list.map(({ row }) => <TeamRow key={row.team} abbr={row.team} onOpen={onOpen} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// バスケのロースター成績カラム（1試合平均＋FG%）。
const ROSTER_COLS = [
  { key: "pos", label: "POS" },
  { key: "ppg", label: "PPG" },
  { key: "rpg", label: "RPG" },
  { key: "apg", label: "APG" },
  { key: "spg", label: "SPG" },
  { key: "bpg", label: "BPG" },
  { key: "fg", label: "FG%" },
];

function StatTable({ rows, cols, empty }) {
  if (!rows || rows.length === 0) {
    return <div className="muted" style={{ fontSize: 16, padding: "14px 4px" }}>{empty}</div>;
  }
  return (
    <div className="table-scroll"><table>
      <thead>
        <tr>
          <th>選手</th>
          {cols.map((c) => <th key={c.key} className="num">{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((p, i) => (
          <tr key={p.name || i}>
            <td style={{ fontWeight: 700 }}>{p.name || "—"}</td>
            {cols.map((c) => <td key={c.key} className="num mono">{p[c.key] || "—"}</td>)}
          </tr>
        ))}
      </tbody>
    </table></div>
  );
}

function TeamDetailPage({ abbr, onBack }) {
  const t = team(abbr);
  const s = findStanding(abbr);
  const data = TEAM_DATA[abbr] || {};
  const divName = (() => {
    const c = CONFS().find((x) => x.key === t.conference) || (s && s.conf);
    const d = c && (c.divisions || []).find((x) => x.key === t.division);
    return d ? d.name : t.division || "";
  })();
  const meta = [
    s && s.conf ? s.conf.name : "",
    divName ? divName + "・ディビジョン" : "",
    t.city ? "本拠地 " + t.city : "",
    t.coach ? "監督 " + t.coach : "",
  ].filter(Boolean);

  return (
    <div>
      <button className="back-btn" onClick={onBack}>← クラブ一覧へ</button>

      <div className="card" style={{ borderColor: t.color, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", flexWrap: "wrap" }}>
          <Badge abbr={abbr} size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.4 }}>{t.name}</div>
            {meta.length ? (
              <div className="muted" style={{ fontSize: 14, marginTop: 4, lineHeight: 1.7 }}>{meta.join("　|　")}</div>
            ) : null}
            {s ? (
              <div style={{ fontSize: 16, marginTop: 6 }}>
                <b>カンファレンス{s.rank}位</b>　{s.w}勝{s.l}敗（{pct(s.w, s.l)}）　GB {sv(s.gb)}　{sv(s.strk)}
                {s.clinch ? <span style={{ marginLeft: 8 }}><ClinchTag c={s.clinch} /></span> : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <SectionHead kicker="Roster" title="選手（ロースター）" />
      <div className="card">
        <StatTable rows={data.batters} cols={ROSTER_COLS} empty="選手データは準備中です（CMSのシーズン編集から登録できます）" />
      </div>
    </div>
  );
}

function TeamsSection({ teamAbbr, setTeamAbbr }) {
  if (teamAbbr) return <TeamDetailPage abbr={teamAbbr} onBack={() => setTeamAbbr(null)} />;
  return <TeamsPage onOpen={setTeamAbbr} />;
}

/* ---- セクションシェル（内部タブ） ---- */
const TABS = [
  { id: "home", label: "Home" },
  { id: "news", label: "News" },
  { id: "teams", label: "Teams" },
  { id: "standings", label: "Standings" },
  { id: "postseason", label: "Postseason" },
  { id: "stats", label: "Stats" },
  { id: "awards", label: "Awards" },
  { id: "draft", label: "Draft" },
];
export default function Season2042({ year }) {
  applyYear(year); // 選択年のデータを適用（描画前）
  const [page, setPage] = useState("home");
  const [articleId, setArticleId] = useState(null);
  const [teamAbbr, setTeamAbbr] = useState(null);
  const openArticle = (id) => { setArticleId(id); setPage("news"); };
  const goTab = (p) => { setArticleId(null); setTeamAbbr(null); setPage(p); };
  return (
    <div className="jbu2042">
      <nav className="nav">
        {TABS.map((n) => (
          <button key={n.id} className={page === n.id ? "active" : ""} onClick={() => goTab(n.id)}>{n.label}</button>
        ))}
      </nav>
      {page === "home" && <HomePage go={goTab} onOpen={openArticle} />}
      {page === "news" && <NewsPage articleId={articleId} setArticleId={setArticleId} />}
      {page === "teams" && <TeamsSection teamAbbr={teamAbbr} setTeamAbbr={setTeamAbbr} />}
      {page === "standings" && <StandingsPage />}
      {page === "postseason" && <PostseasonPage />}
      {page === "prospects" && <ProspectsPage />}
      {page === "stats" && <StatsPage />}
      {page === "awards" && <AwardsPage />}
      {page === "draft" && <DraftPage />}
    </div>
  );
}
