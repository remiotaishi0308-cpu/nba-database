import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getArticleById, getArticles } from "../lib/dataService";

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

function HeroImage({ src, alt, category }) {
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
        className={`aspect-[16/7] w-full bg-gradient-to-br ${grad} rounded-xl border border-jbu-border flex items-center justify-center`}
      >
        <span className="text-xs tracking-[0.4em] text-white/70 font-bold">
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
      className="aspect-[16/7] w-full object-cover rounded-xl border border-jbu-border"
      loading="eager"
    />
  );
}

export default function ArticleDetail() {
  const { id } = useParams();
  const article = getArticleById(id);

  if (!article) {
    return (
      <div className="space-y-4 text-center py-20">
        <div className="text-[10px] tracking-[0.3em] text-jbu-muted">
          NOT FOUND
        </div>
        <div className="text-xl font-bold">記事が見つかりません</div>
        <Link
          to="/articles"
          className="inline-block text-jbu-accent text-sm hover:underline"
        >
          ← 記事一覧へ戻る
        </Link>
      </div>
    );
  }

  // Up to three more recent articles, excluding this one.
  const related = getArticles()
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <article className="space-y-8 max-w-3xl mx-auto">
      <nav className="text-xs">
        <Link to="/articles" className="text-jbu-muted hover:text-jbu-accent">
          ニュース・記事
        </Link>
        <span className="text-jbu-muted mx-2">/</span>
        <span className="text-jbu-text truncate">{article.title}</span>
      </nav>

      <HeroImage
        src={article.thumbnailUrl}
        alt={article.title}
        category={article.category}
      />

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={article.category} />
          {article.season && (
            <Link
              to={`/y/${article.season}`}
              className="text-[10px] tracking-widest px-2 py-0.5 rounded-sm bg-jbu-accent/15 text-jbu-accent border border-jbu-accent/30 hover:bg-jbu-accent/25 transition-colors"
            >
              {article.season} SEASON →
            </Link>
          )}
          <span className="text-[10px] text-jbu-muted tracking-widest tabular-nums">
            {article.date}
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl leading-tight">
          {article.title}
        </h1>
        {article.summary && (
          <p className="text-sm md:text-base leading-relaxed border-l-2 border-jbu-accent pl-3 text-jbu-text/90">
            {article.summary}
          </p>
        )}
        {Array.isArray(article.tags) && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {article.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] text-jbu-muted bg-jbu-surface-2 border border-jbu-border rounded-sm px-2 py-0.5"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </header>

      <section className="prose-jbu">
        {(article.content || "")
          .split(/\n\n+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .map((block, i) => {
            // Inline images: a block written as Markdown image syntax
            // ![alt](/images/articles/foo.jpg) — this is what the CMS emits when
            // you drop an image into the body. Rendered as a captioned figure.
            const img = block.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
            if (img) {
              const [, alt, url] = img;
              return (
                <figure key={i} className="my-6">
                  <img
                    src={url}
                    alt={alt}
                    className="w-full rounded-xl border border-jbu-border"
                    loading="lazy"
                  />
                  {alt && (
                    <figcaption className="text-[11px] text-jbu-muted mt-2 text-center">
                      {alt}
                    </figcaption>
                  )}
                </figure>
              );
            }
            // Section markers (lines that start with ■) become inline headings
            // so long-form interviews stay scannable. Everything else renders
            // as a flowing paragraph.
            if (block.startsWith("■")) {
              return (
                <h2
                  key={i}
                  className="font-display text-xl md:text-2xl leading-tight text-jbu-accent border-l-4 border-jbu-accent pl-3 mt-10 mb-4"
                >
                  {block.replace(/^■\s*/, "")}
                </h2>
              );
            }
            return (
              <p
                key={i}
                className="text-sm md:text-base leading-loose text-jbu-text/90 mb-5"
              >
                {block}
              </p>
            );
          })}
      </section>

      {related.length > 0 && (
        <aside className="pt-6 border-t border-jbu-border">
          <div className="text-[10px] tracking-[0.4em] text-jbu-accent mb-3">
            RELATED ARTICLES
          </div>
          <ul className="divide-y divide-jbu-border">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  to={`/articles/${r.id}`}
                  className="block py-3 hover:bg-jbu-surface-2/40 -mx-2 px-2 rounded transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CategoryBadge category={r.category} />
                    <span className="text-[10px] text-jbu-muted tabular-nums">
                      {r.date}
                    </span>
                  </div>
                  <div className="text-sm font-bold leading-snug">
                    {r.title}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <div className="pt-4">
        <Link
          to="/articles"
          className="inline-block text-jbu-accent text-sm hover:underline"
        >
          ← 記事一覧へ戻る
        </Link>
      </div>
    </article>
  );
}
