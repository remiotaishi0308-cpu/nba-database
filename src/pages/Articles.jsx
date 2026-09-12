import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getArticleCategories, getArticles } from "../lib/dataService";
import SectionTitle from "../components/SectionTitle";

// Tailwind color mapping per category. Falls back to the JBU accent for any
// future category not in this map.
const CATEGORY_STYLES = {
  インタビュー: "bg-sky-500/20 text-sky-300 border border-sky-500/40",
  ニュース: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
  特集: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
};

function CategoryBadge({ category }) {
  if (!category) return null;
  const cls =
    CATEGORY_STYLES[category] ??
    "bg-jbu-accent/15 text-jbu-accent border border-jbu-accent/30";
  return (
    <span className={`text-[10px] tracking-widest px-2 py-0.5 rounded-sm ${cls}`}>
      {category}
    </span>
  );
}

// Thumbnail with graceful fallback. If the image is missing or 404s, we render
// a category-tinted gradient block with the category label.
function Thumbnail({ src, alt, category }) {
  const [errored, setErrored] = useState(!src);
  if (errored) {
    const grad =
      category === "インタビュー"
        ? "from-sky-700/60 to-sky-950"
        : category === "ニュース"
        ? "from-emerald-700/60 to-emerald-950"
        : category === "特集"
        ? "from-amber-700/60 to-amber-950"
        : "from-jbu-accent/40 to-jbu-bg";
    return (
      <div
        className={`aspect-[16/9] w-full bg-gradient-to-br ${grad} flex items-center justify-center`}
      >
        <span className="text-[10px] tracking-[0.4em] text-white/70 font-bold">
          {category?.toUpperCase() ?? "ARTICLE"}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErrored(true)}
      className="aspect-[16/9] w-full object-cover"
      loading="lazy"
    />
  );
}

function ArticleCard({ article }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group bg-jbu-surface border border-jbu-border rounded-lg overflow-hidden flex flex-col hover:border-jbu-accent/60 transition-colors"
    >
      <Thumbnail
        src={article.thumbnailUrl}
        alt={article.title}
        category={article.category}
      />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <CategoryBadge category={article.category} />
          <span className="text-[10px] text-jbu-muted tracking-widest tabular-nums">
            {article.date}
          </span>
        </div>
        <h3 className="text-base font-bold leading-snug group-hover:text-jbu-accent transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-jbu-muted leading-relaxed line-clamp-3">
          {article.summary}
        </p>
      </div>
    </Link>
  );
}

export default function Articles() {
  const [filter, setFilter] = useState("ALL");
  const categories = useMemo(() => getArticleCategories(), []);
  const list = useMemo(
    () => getArticles(filter === "ALL" ? {} : { category: filter }),
    [filter]
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="JBU NEWSROOM"
        title="ニュース・記事"
      />

      <div className="flex flex-wrap gap-2">
        <FilterPill
          label="すべて"
          active={filter === "ALL"}
          onClick={() => setFilter("ALL")}
        />
        {categories.map((c) => (
          <FilterPill
            key={c}
            label={c}
            active={filter === c}
            onClick={() => setFilter(c)}
          />
        ))}
      </div>

      {list.length === 0 ? (
        <div className="bg-jbu-surface border border-dashed border-jbu-border rounded-lg p-10 text-center text-xs text-jbu-muted">
          該当する記事はありません。
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-md text-xs font-bold tracking-wider transition-colors",
        active
          ? "bg-jbu-accent text-jbu-bg"
          : "bg-jbu-surface border border-jbu-border text-jbu-muted hover:text-jbu-text",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
