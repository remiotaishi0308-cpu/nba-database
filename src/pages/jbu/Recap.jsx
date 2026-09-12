import { useOutletContext } from "react-router-dom";
import { getSeasonRecap } from "../../lib/dataService";
import { ComingSoon, SectionCard } from "../../components/Placeholder";

export default function Recap() {
  const { year } = useOutletContext();
  const recap = getSeasonRecap(year);
  if (!recap) return <ComingSoon year={year} label="シーズン総括・ブログ" />;

  return (
    <article className="space-y-4">
      <SectionCard kicker={`${year} RECAP`} title={recap.title}>
        <div className="flex items-center gap-3 text-xs text-jbu-muted mb-3">
          <span>{recap.author}</span>
          <span>•</span>
          <span>{recap.publishedAt}</span>
        </div>
        <p className="text-sm leading-relaxed border-l-2 border-jbu-accent pl-3 text-jbu-text">
          {recap.headline}
        </p>
      </SectionCard>
      <div className="space-y-3">
        {recap.sections.map((s, i) => (
          <SectionCard key={i} title={s.h}>
            <p className="text-sm leading-relaxed text-jbu-text/90">{s.p}</p>
          </SectionCard>
        ))}
      </div>
    </article>
  );
}
