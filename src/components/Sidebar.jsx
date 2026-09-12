import { NavLink, useLocation, useMatch } from "react-router-dom";
import { CURRENT_YEAR } from "../lib/dataService";

// "Selected year" — the segment of the current pathname under /y/:year, if
// any. Falls back to CURRENT_YEAR so each tab links to the latest season when
// the user is on a non-year route (/teams, /records, /highschool).
function useActiveYear() {
  const m = useMatch("/y/:year/*");
  const yearParam = Number(m?.params?.year);
  return Number.isFinite(yearParam) ? yearParam : CURRENT_YEAR;
}

// `hidden: true` の項目はサイドバーに表示しない（定義は残し、後日トップの
// ヘッダーへ移設できるようにしている）。表示に戻すには hidden を外すだけ。
function buildNav(year) {
  return [
    {
      section: "MAIN MENU",
      items: [
        {
          to: `/y/${year}`,
          label: "トップ",
          icon: "◆",
          matchPattern: `/y/${year}`,
          end: true,
          hidden: true,
        },
        {
          to: `/y/${year}/draft`,
          label: "ドラフト情報",
          icon: "✦",
          matchPattern: `/y/${year}/draft`,
          hidden: true,
        },
        {
          to: `/y/${year}/transactions`,
          label: "入退団",
          icon: "⇄",
          matchPattern: `/y/${year}/transactions`,
          hidden: true,
        },
        {
          to: `/y/${year}/stats`,
          label: "チーム・個人成績",
          icon: "⬢",
          matchPattern: `/y/${year}/stats`,
          hidden: true,
        },
      ],
    },
    {
      section: "DATABASE",
      items: [
        { to: "/teams", label: "チーム一覧", icon: "⌘", matchPrefix: "/teams", hidden: true },
        { to: "/records", label: "歴代記録", icon: "★", hidden: true },
        {
          to: "/highschool/tournaments",
          label: "高校野球DB",
          icon: "⌬",
          matchPrefix: "/highschool",
          hidden: true,
        },
      ],
    },
  ];
}

function Item({ to, label, icon, end, matchPrefix, matchPattern, onNavigate }) {
  const location = useLocation();
  // matchPattern: exact pathname (used when we need to disambiguate the year
  // portal's index tab from sub-tabs because the URL prefix overlaps).
  const matchedByPattern = useMatch({ path: matchPattern ?? "__none__", end: true });
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) => {
        const active =
          isActive ||
          (matchPrefix && location.pathname.startsWith(matchPrefix)) ||
          (matchPattern && matchedByPattern);
        return [
          "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors border-l-2",
          active
            ? "bg-jbu-accent/15 text-jbu-accent border-jbu-accent"
            : "text-jbu-muted hover:bg-jbu-surface-2 hover:text-jbu-text border-transparent",
        ].join(" ");
      }}
    >
      <span className="w-4 text-center">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

function SidebarInner({ onNavigate, onClose }) {
  const year = useActiveYear();
  const nav = buildNav(year);

  return (
    <>
      <div className="px-5 py-6 border-b border-jbu-border flex items-start justify-between gap-3">
        {/* JBU OFFICIAL ロゴ（仮）。後日、画像ロゴに差し替える場合は
            この <div> を <img src="..." /> に置き換えてください。 */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-jbu-accent text-jbu-bg font-display font-bold text-xl grid place-items-center leading-none">
            J
          </div>
          <div className="leading-none">
            <div className="font-display text-lg tracking-wide text-jbu-text">
              JBU
            </div>
            <div className="mt-0.5 text-[9px] tracking-[0.3em] text-jbu-muted">
              OFFICIAL
            </div>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="メニューを閉じる"
            className="md:hidden text-jbu-muted hover:text-jbu-text text-xl leading-none -mt-1 -mr-1 px-2 py-1"
          >
            ✕
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
        {nav.map((entry) => {
          const items = entry.items.filter((i) => !i.hidden);
          if (!items.length) return null;
          return (
            <div key={entry.section}>
              <div className="px-3 mb-1 text-[9px] tracking-[0.3em] text-jbu-muted/70 uppercase">
                {entry.section}
              </div>
              <div className="space-y-0.5">
                {items.map((item) => (
                  <Item key={item.to} {...item} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-jbu-border text-[10px] text-jbu-muted leading-relaxed">
        © 2039 JBU Database
        <br />
        15 seasons of records.
      </div>
    </>
  );
}

export default function Sidebar({ mobileOpen = false, onClose }) {
  return (
    <>
      {/* Desktop: static sidebar, always visible from md+. */}
      <aside className="hidden md:flex md:flex-col w-60 shrink-0 bg-jbu-surface border-r border-jbu-border">
        <SidebarInner />
      </aside>

      {/* Mobile: backdrop + slide-in drawer. */}
      <div
        className={`md:hidden fixed inset-0 bg-black/60 z-30 transition-opacity ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-40 w-64 bg-jbu-surface border-r border-jbu-border flex flex-col shadow-2xl transition-transform duration-200 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        <SidebarInner onNavigate={onClose} onClose={onClose} />
      </aside>
    </>
  );
}
