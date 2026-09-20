import { useEffect } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import YearSelector from "../components/YearSelector";
import { CURRENT_YEAR, JBU_YEARS, isMlbEra } from "../lib/dataService";
import Season2042 from "./jbu2042/Season2042";
import { BRAND } from "../lib/brand";

const TABS = [
  { to: ".", label: "トップ", icon: "◆", end: true },
  { to: "articles", label: "記事", icon: "✍" },
  { to: "draft", label: "ドラフト", icon: "✦" },
  { to: "transactions", label: "入退団", icon: "⇄" },
  { to: "stats", label: "チーム・個人成績", icon: "⬢" },
];

export default function YearPortalLayout() {
  const { year } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const yearNum = Number(year);
  const isValid = JBU_YEARS.includes(yearNum);

  useEffect(() => {
    if (!isValid) navigate(`/y/${CURRENT_YEAR}`, { replace: true });
  }, [isValid, navigate]);

  if (!isValid) return null;

  // Year switch preserves the currently active sub-tab (.../draft, .../blog…)
  const onYearChange = (newYear) => {
    const tail = location.pathname.replace(/^\/y\/\d{4}/, "");
    navigate(`/y/${newYear}${tail}`);
  };

  return (
    <div className="space-y-6">
      {/* Year selector strip */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div>
          <div className="text-sm font-bold tracking-[0.16em] text-jbu-accent">
            {BRAND.short} {BRAND.tagline} · SEASON PORTAL
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl mt-1 leading-[1.4]">
            {BRAND.portalTitle}
          </h1>
        </div>
        <YearSelector
          years={JBU_YEARS}
          current={yearNum}
          onChange={onYearChange}
        />
      </div>

      {/* 2042+ は MLB レギュレーションの自己完結セクションを描画。
          2041 以前は従来の NPB タブ + Outlet。 */}
      {isMlbEra(yearNum) ? (
        <Season2042 year={yearNum} />
      ) : (
        <>
          {/* Tab nav (sticky-feel under year selector) */}
          <div className="border-b border-jbu-border overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <div className="flex gap-1 min-w-max">
              {TABS.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.end}
                  className={({ isActive }) =>
                    [
                      "relative px-4 py-2.5 text-sm whitespace-nowrap transition-colors",
                      isActive
                        ? "text-jbu-accent"
                        : "text-jbu-muted hover:text-jbu-text",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-1.5">
                        <span className="opacity-70">{t.icon}</span>
                        {t.label}
                      </span>
                      <span
                        className={`absolute left-0 right-0 -bottom-px h-0.5 transition-all ${
                          isActive ? "bg-jbu-accent" : "bg-transparent"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          <Outlet context={{ year: yearNum }} />
        </>
      )}
    </div>
  );
}
