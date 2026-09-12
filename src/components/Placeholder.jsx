export function ComingSoon({ year, label }) {
  return (
    <div className="bg-jbu-surface border border-dashed border-jbu-border rounded-lg p-10 text-center">
      <div className="text-[10px] tracking-[0.3em] text-jbu-accent">
        DATA PENDING
      </div>
      <div className="mt-2 text-jbu-text font-bold">
        {year ? `${year}年度の` : ""}
        {label}データは準備中です
      </div>
      <p className="text-xs text-jbu-muted mt-2 max-w-md mx-auto leading-relaxed">
        この画面はデータが投入されると自動的に描画されます。src/data/ 配下のJSONを更新するだけでOK。
      </p>
    </div>
  );
}

export function SectionCard({ kicker, title, children, footer }) {
  return (
    <section className="bg-jbu-surface border border-jbu-border rounded-lg overflow-hidden">
      {(kicker || title) && (
        <header className="px-5 py-4 border-b border-jbu-border flex items-end justify-between">
          <div>
            {kicker && (
              <div className="text-[10px] tracking-widest text-jbu-accent">
                {kicker}
              </div>
            )}
            {title && (
              <h2 className="text-base md:text-lg font-bold leading-tight mt-0.5">
                {title}
              </h2>
            )}
          </div>
          {footer}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}
