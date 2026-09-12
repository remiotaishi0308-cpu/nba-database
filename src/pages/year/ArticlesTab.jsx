import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { getArticlesByYear } from "../../lib/dataService";
import SectionTitle from "../../components/SectionTitle";

// Season-scoped article list. Cards link to the shared /articles/:id detail
// page so we reuse the existing article reader for every season.

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

function Thumbnail({ src, category }) {
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
      <div className={`aspect-[16/9] w-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
        <span className="text-[10px] tracking-[0.4em] text-white/70 font-bold">
          {category?.toUpperCase() ?? "ARTICLE"}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt=""
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
      <Thumbnail src={article.thumbnailUrl} category={article.category} />
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

export default function ArticlesTab() {
  const { year } = useOutletContext();
  const list = getArticlesByYear(year);

  return (
    <div className="space-y-6">
      <SectionTitle kicker={`${year} ARTICLES`} title={`${year} シーズンの記事`} />

      {list.length === 0 ? (
        <div className="bg-jbu-surface border border-dashed border-jbu-border rounded-lg p-10 text-center text-xs text-jbu-muted">
          {year}年シーズンの記事はまだありません。
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
