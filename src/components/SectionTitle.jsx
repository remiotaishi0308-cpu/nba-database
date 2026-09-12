export default function SectionTitle({ kicker, title, action }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        {kicker && (
          <div className="text-[10px] tracking-[0.3em] text-jbu-accent mb-1">
            {kicker}
          </div>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-jbu-text leading-none">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
