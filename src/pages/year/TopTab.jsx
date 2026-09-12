import { Link, useOutletContext } from "react-router-dom";
import { useState } from "react";
import {
  getCurrentSeason,
  getJapanSeries,
  getSeasonRecap,
  getStandings,
  getTeamByName,
  getYearMedia,
} from "../../lib/dataService";
import TeamBadge from "../../components/TeamBadge";
import Standings from "../jbu/Standings";
import ClimaxSeries from "../jbu/ClimaxSeries";
import JapanSeries from "../jbu/JapanSeries";
import Awards from "../jbu/Awards";

// ---- Hero ----------------------------------------------------------------
// Background-image driven banner (no <img>). Two stacked layers via the CSS
// `background` shorthand: heroImageUrl on top, team-color gradient beneath.
// If the URL is empty or the asset 404s, the gradient shows through.

function Hero({ year }) {
  const season = getCurrentSeason();
  const media = getYearMedia(year);
  const standings = getStandings(year);
  const cenTop = standings?.central?.[0];
  const pacTop = standings?.pacific?.[0];
  const cenTeam = cenTop ? getTeamByName(cenTop.teamName) : null;
  const pacTeam = pacTop ? getTeamByName(pacTop.teamName) : null;

  // Japan Series champion — present only for completed postseasons. We hide
  // the chip entirely when the year has no japanSeries.json entry yet.
  const js = getJapanSeries(year);
  const champTeam = js?.champion ? getTeamByName(js.champion) : null;

  const colorL = cenTeam?.primaryColor ?? "#f59e0b";
  const colorR = pacTeam?.primaryColor ?? "#22d3ee";
  const isCurrent = year === season.current;

  const fallbackGradient = `linear-gradient(135deg, ${colorL}55 0%, #111 45%, #050505 70%, ${colorR}55 100%)`;
  const heroUrl = media?.heroImageUrl
    ? normalizePublicImageSrc(media.heroImageUrl)
    : null;
  const heroBackground = heroUrl
    ? `url("${heroUrl}") center / cover no-repeat, ${fallbackGradient}`
    : fallbackGradient;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-jbu-border
                 aspect-[16/9] min-h-[260px]
                 sm:aspect-auto sm:min-h-[340px]
                 md:min-h-[520px] lg:min-h-[600px]"
      style={{ background: heroBackground }}
    >
      {/* Black overlay — guarantees text contrast on any photo. */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* Extra bottom-emphasis gradient so the title area is darkest where the
          text sits — classic broadcast / sports-site treatment. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent pointer-events-none" />

      {/* Team-color halos for energy */}
      <div
        className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none mix-blend-screen"
        style={{ background: colorR }}
      />
      <div
        className="absolute -top-16 -left-16 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none mix-blend-screen"
        style={{ background: colorL }}
      />

      {/* Content — anchored bottom-left, sports-portal style. */}
      <div className="absolute inset-0 flex flex-col justify-end px-4 py-5 sm:px-6 sm:py-8 md:px-12 md:py-12 lg:py-14">
        <div className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.35em] sm:tracking-[0.5em] text-jbu-accent font-bold drop-shadow-lg">
          {isCurrent
            ? (season.phase || "REGULAR SEASON").toUpperCase()
            : "SEASON ARCHIVE"}
        </div>

        <h1 className="mt-1 sm:mt-2 md:mt-3 font-display font-bold leading-[0.92] text-white drop-shadow-lg text-4xl sm:text-5xl md:text-7xl lg:text-8xl">
          {year}{" "}
          <span className="text-jbu-accent">JBU</span>{" "}
          SEASON
        </h1>

        {media?.subCopy && (
          <p className="mt-2 sm:mt-4 md:mt-5 font-display font-black leading-tight text-white drop-shadow-lg text-lg sm:text-2xl md:text-4xl lg:text-5xl max-w-3xl">
            {media.subCopy}
          </p>
        )}

        {(champTeam || cenTeam || pacTeam) && (
          <div className="mt-3 sm:mt-5 md:mt-6 flex flex-wrap gap-1.5 sm:gap-3">
            {champTeam && (
              <ChampionChip team={champTeam} fallbackName={js.champion} />
            )}
            {cenTeam && (
              <HeroChip
                label="CENTRAL 1位"
                team={cenTeam}
                winsLine={`${cenTop.wins}勝${cenTop.losses}敗`}
              />
            )}
            {pacTeam && (
              <HeroChip
                label="PACIFIC 1位"
                team={pacTeam}
                winsLine={`${pacTop.wins}勝${pacTop.losses}敗`}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function HeroChip({ label, team, winsLine }) {
  return (
    <div
      className="flex items-center gap-1 sm:gap-3 bg-black/70 backdrop-blur-sm border rounded sm:rounded-xl px-1 py-0.5 sm:px-3 sm:py-2 shadow-lg"
      style={{ borderColor: team.primaryColor }}
    >
      {/* Responsive badge — extra-compact via scale on phones; native sized md from sm-breakpoint up. */}
      <span className="inline-flex sm:hidden scale-90 origin-left">
        <TeamBadge team={team} size="sm" />
      </span>
      <span className="hidden sm:inline-flex">
        <TeamBadge team={team} size="md" />
      </span>
      <div className="leading-tight">
        <div
          className="text-[7px] sm:text-[10px] tracking-wider sm:tracking-widest font-bold"
          style={{ color: team.primaryColor }}
        >
          {label}
        </div>
        <div className="text-[10px] sm:text-sm font-bold text-white whitespace-nowrap">
          {team.shortName ?? team.name}
        </div>
        <div className="text-[7px] sm:text-[10px] text-white/60 tabular-nums">
          {winsLine}
        </div>
      </div>
    </div>
  );
}

// Minimal inline crown icon — uses currentColor so the gold accent flows
// through from the parent class.
function CrownIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M3 7l4.5 3.2L12 4l4.5 6.2L21 7l-1.6 11H4.6L3 7zm1.8 12.4h14.4V21H4.8v-1.6z" />
    </svg>
  );
}

// Special-tier chip for the Japan Series champion. Gold accent + crown icon
// signal that this sits above the regular-season pennant chips.
function ChampionChip({ team, fallbackName }) {
  return (
    <div
      className="relative flex items-center gap-1 sm:gap-3 rounded sm:rounded-xl px-1 py-0.5 sm:px-3 sm:py-2 shadow-lg
                 border-2 border-yellow-400/80
                 bg-gradient-to-br from-yellow-500/25 via-black/70 to-black/80
                 backdrop-blur-sm
                 ring-1 ring-yellow-300/40"
    >
      {/* Subtle inner highlight to give the chip a metallic feel */}
      <div className="absolute inset-0 rounded sm:rounded-xl pointer-events-none ring-1 ring-inset ring-white/10" />

      <div className="relative flex items-center gap-1 sm:gap-3">
        <CrownIcon className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-300 drop-shadow shrink-0" />
        <span className="inline-flex sm:hidden scale-90 origin-left">
          <TeamBadge team={team} size="sm" />
        </span>
        <span className="hidden sm:inline-flex">
          <TeamBadge team={team} size="md" />
        </span>
        <div className="leading-tight">
          <div className="text-[7px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] font-black text-yellow-300 flex items-center gap-1">
            <span className="sm:hidden">JS CHAMPION</span>
            <span className="hidden sm:inline">JAPAN SERIES CHAMPION</span>
          </div>
          <div className="text-[10px] sm:text-sm font-bold text-white whitespace-nowrap">
            {team?.shortName ?? team?.name ?? fallbackName}
          </div>
          <div className="text-[7px] sm:text-[10px] text-yellow-200/70 tracking-widest">
            日本一
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Section frame -------------------------------------------------------

function Section({ kicker, title, anchor, action, children }) {
  return (
    <section id={anchor} className="scroll-mt-20">
      <div className="flex items-end justify-between gap-3 mb-4 border-b border-jbu-border pb-2">
        <div>
          <div className="text-[10px] tracking-[0.4em] text-jbu-accent">
            {kicker}
          </div>
          <h2 className="font-display text-2xl md:text-3xl leading-tight mt-1">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div>{children}</div>
    </section>
  );
}

// ---- Article-style recap -------------------------------------------------
// Pulls eyecatch from year media, body content from seasonRecaps.json.

function normalizePublicImageSrc(src) {
  if (!src) return src;
  if (/^https?:\/\//.test(src)) return src;
  if (src.startsWith("/")) {
    const baseUrl = import.meta.env.BASE_URL || "/";
    const base = baseUrl.startsWith("http")
      ? baseUrl
      : `${window.location.origin}${baseUrl}`;
    return new URL(src.replace(/^\//, ""), base).href;
  }
  return src;
}

function SummaryEyecatch({ srcs, alt }) {
  const sources = (Array.isArray(srcs) ? srcs : srcs ? [srcs] : [])
    .filter(Boolean)
    .map(normalizePublicImageSrc);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  if (!sources.length) {
    return (
      <div className="aspect-[16/7] w-full rounded-xl border border-dashed border-jbu-border bg-jbu-surface-2 flex items-center justify-center text-[10px] tracking-widest text-jbu-muted">
        EYECATCH PENDING
      </div>
    );
  }

  const validImages = sources.filter((_, index) => !imageErrors[index]);
  if (!validImages.length) {
    return (
      <div className="aspect-[16/7] w-full rounded-xl border border-dashed border-jbu-border bg-jbu-surface-2 flex items-center justify-center text-[10px] tracking-widest text-jbu-muted">
        IMAGES FAILED TO LOAD
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 grid-cols-1">
      {sources.map((src, index) =>
        !imageErrors[index] ? (
          <img
            key={`${src}-${index}`}
            src={src}
            alt={`${alt} ${index + 1}`}
            onError={() => handleImageError(index)}
            className="w-full aspect-[16/7] object-cover rounded-xl border border-jbu-border shadow-lg hover:shadow-xl transition-shadow"
            loading="lazy"
          />
        ) : null
      )}
    </div>
  );
}

function RecapArticle({ year }) {
  const recap = getSeasonRecap(year);
  const media = getYearMedia(year);
  const summarySources =
    media?.summaryImages ??
    (media?.summaryImageUrl ? [media.summaryImageUrl] : []);

  if (!recap && !summarySources.length) {
    return (
      <div className="bg-jbu-surface border border-dashed border-jbu-border rounded-lg p-8 text-center text-xs text-jbu-muted">
        {year}年 シーズン総括は準備中です。
      </div>
    );
  }

  return (
    <article className="space-y-6">
      <SummaryEyecatch
        srcs={summarySources}
        alt={`${year} シーズン総括 アイキャッチ`}
      />

      {recap && (
        <>
          <header className="space-y-2">
            <div className="text-[10px] tracking-[0.3em] text-jbu-accent">
              JBU EDITORIAL · {year}
            </div>
            <h3 className="font-display text-2xl md:text-3xl leading-tight">
              {recap.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-jbu-muted">
              <span>{recap.author}</span>
              <span>•</span>
              <span>{recap.publishedAt}</span>
            </div>
            {recap.headline && (
              <p className="text-sm md:text-base leading-relaxed border-l-2 border-jbu-accent pl-3 text-jbu-text/90 mt-2">
                {recap.headline}
              </p>
            )}
          </header>

          <div className="space-y-5 max-w-3xl">
            {(recap.sections ?? []).map((s, i) => (
              <div key={i}>
                {s.h && (
                  <h4 className="text-base md:text-lg font-bold mb-1 leading-tight">
                    {s.h}
                  </h4>
                )}
                <p className="text-sm leading-relaxed text-jbu-text/90">
                  {s.p}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}

// ---- Page ----------------------------------------------------------------

export default function TopTab() {
  const { year } = useOutletContext();
  return (
    <div className="space-y-14">
      <Hero year={year} />

      <Section kicker="STANDINGS" title="順位表" anchor="standings">
        <Standings />
      </Section>

      <Section kicker="POSTSEASON" title="クライマックスシリーズ" anchor="cs">
        <ClimaxSeries />
      </Section>

      <Section kicker="POSTSEASON" title="日本シリーズ" anchor="japan-series">
        <JapanSeries />
      </Section>

      <Section kicker="RECAP" title="シーズン総括" anchor="recap">
        <RecapArticle year={year} />
      </Section>

      <Section
        kicker="AWARDS"
        title="表彰・タイトル"
        anchor="titles"
        action={
          <Link
            to="/teams"
            className="text-xs text-jbu-accent hover:underline whitespace-nowrap"
          >
            チーム一覧へ →
          </Link>
        }
      >
        <Awards />
      </Section>
    </div>
  );
}
