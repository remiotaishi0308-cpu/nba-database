import { useOutletContext } from "react-router-dom";
import { getTransactions } from "../../lib/dataService";
import { ComingSoon, SectionCard } from "../../components/Placeholder";

const TYPE_COLOR = {
  新加入: "bg-emerald-500/15 text-emerald-300",
  トレード: "bg-sky-500/15 text-sky-300",
  引退: "bg-rose-500/15 text-rose-300",
  現役引退表明: "bg-rose-500/15 text-rose-300",
  FA移籍: "bg-amber-500/15 text-amber-300",
};

export default function Transactions() {
  const { year } = useOutletContext();
  const items = getTransactions(year);
  if (!items.length) return <ComingSoon year={year} label="入退団情報" />;

  return (
    <SectionCard kicker="TRANSACTIONS" title={`${year}年 入退団・契約動向`}>
      <ul className="divide-y divide-jbu-border">
        {items.map((tx, i) => (
          <li key={i} className="py-3 flex gap-4 items-start">
            <div className="text-[10px] tracking-widest text-jbu-muted w-20 pt-1 shrink-0">{tx.date}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[10px] px-2 py-0.5 rounded-sm tracking-wider ${TYPE_COLOR[tx.type] ?? "bg-jbu-surface-2 text-jbu-text"}`}>
                  {tx.type}
                </span>
                <span className="font-bold">{tx.player}</span>
              </div>
              <div className="text-xs text-jbu-muted">{tx.fromTo}</div>
              {tx.note && <div className="text-xs text-jbu-muted mt-1">{tx.note}</div>}
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
