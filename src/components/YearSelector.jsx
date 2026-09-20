import { useState, useRef, useEffect } from "react";
import { seasonLabel } from "../lib/dataService";

export default function YearSelector({ years, current, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  const idx = years.indexOf(current);
  const prev = idx > 0 ? years[idx - 1] : null;
  const next = idx < years.length - 1 ? years[idx + 1] : null;

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={!prev}
        onClick={() => prev && onChange(prev)}
        className="w-8 h-8 flex items-center justify-center rounded-md bg-jbu-surface border border-jbu-border text-jbu-muted hover:text-jbu-accent disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="前の年度"
      >
        ‹
      </button>

      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-3 bg-gradient-to-br from-jbu-surface to-jbu-surface-2 border border-jbu-border hover:border-jbu-accent/70 rounded-md px-4 py-1.5 transition-colors"
        >
          <div className="text-left">
            <div className="text-[9px] tracking-[0.3em] text-jbu-muted leading-none">
              SEASON
            </div>
            <div className="font-display text-2xl leading-none mt-0.5 tabular-nums">
              {seasonLabel(current)}
            </div>
          </div>
          <span className="text-jbu-muted text-xs">▾</span>
        </button>
        {open && (
          <div className="absolute left-0 top-full mt-1 z-20 bg-jbu-surface border border-jbu-border rounded-md shadow-lg max-h-72 overflow-auto min-w-[140px]">
            {years.slice().reverse().map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => {
                  onChange(y);
                  setOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm tabular-nums transition-colors ${
                  y === current
                    ? "bg-jbu-accent/15 text-jbu-accent font-bold"
                    : "text-jbu-text hover:bg-jbu-surface-2"
                }`}
              >
                {seasonLabel(y)} シーズン
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={!next}
        onClick={() => next && onChange(next)}
        className="w-8 h-8 flex items-center justify-center rounded-md bg-jbu-surface border border-jbu-border text-jbu-muted hover:text-jbu-accent disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="次の年度"
      >
        ›
      </button>
    </div>
  );
}
