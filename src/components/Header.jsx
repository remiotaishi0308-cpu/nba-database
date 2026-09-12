import { Link } from "react-router-dom";
import { getCurrentSeason } from "../lib/dataService";
import { BRAND } from "../lib/brand";

export default function Header() {
  const season = getCurrentSeason();
  return (
    <header className="sticky top-0 z-10 bg-jbu-bg/95 backdrop-blur border-b border-jbu-border">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* ブランドロゴ（テキスト）。画像ロゴに差し替える場合はこの Link 内を
              <img src="..." /> に置き換えてください。 */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span className="w-9 h-9 rounded-lg bg-jbu-accent text-jbu-bg font-display font-bold text-xl grid place-items-center leading-none">
              {BRAND.short.charAt(0)}
            </span>
            <span className="font-display text-2xl tracking-wide leading-none">
              {BRAND.short}
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs text-jbu-muted ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>LIVE</span>
            <span className="text-jbu-text/40">|</span>
            <span>{season.phase}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
