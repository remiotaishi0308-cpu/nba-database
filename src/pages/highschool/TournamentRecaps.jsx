import { useState } from "react";
import { getTournamentRecaps } from "../../lib/dataService";
import { SectionCard, ComingSoon } from "../../components/Placeholder";

export default function TournamentRecaps() {
  const recaps = getTournamentRecaps();
  const [selectedId, setSelectedId] = useState(recaps[0]?.id);
  const selected = recaps.find((r) => r.id === selectedId);

  if (!recaps.length) return <ComingSoon label="大会総括" />;

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-4">
      <aside className="space-y-2">
        <div className="text-[10px] tracking-widest text-jbu-muted px-1">RECAP LIBRARY</div>
        {recaps.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedId(r.id)}
            className={`w-full text-left p-3 rounded-md border transition-colors ${
              selectedId === r.id
                ? "border-jbu-accent bg-jbu-accent/10"
                : "border-jbu-border bg-jbu-surface hover:border-jbu-accent/50"
            }`}
          >
            <div className="text-[10px] tracking-widest text-jbu-muted">{r.publishedAt}</div>
            <div className="text-sm font-bold mt-1 leading-tight">{r.title}</div>
          </button>
        ))}
      </aside>

      {selected && (
        <article className="space-y-4">
          <SectionCard kicker="RECAP" title={selected.title}>
            <div className="flex items-center gap-3 text-xs text-jbu-muted mb-3">
              <span>{selected.author}</span>
              <span>•</span>
              <span>{selected.publishedAt}</span>
            </div>
            <p className="text-sm leading-relaxed border-l-2 border-jbu-accent pl-3">{selected.headline}</p>
          </SectionCard>
          {selected.sections.map((s, i) => (
            <SectionCard key={i} title={s.h}>
              <p className="text-sm leading-relaxed text-jbu-text/90">{s.p}</p>
            </SectionCard>
          ))}
        </article>
      )}
    </div>
  );
}
