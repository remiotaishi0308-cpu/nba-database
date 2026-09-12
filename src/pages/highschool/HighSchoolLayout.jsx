import { Outlet } from "react-router-dom";
import TabBar from "../../components/TabBar";

const TABS = [
  { to: "tournaments", label: "重賞大会成績", icon: "⌬" },
  { to: "prize-ranking", label: "賞金ランキング", icon: "¥" },
  { to: "schools", label: "高校情報", icon: "⌂" },
  { to: "recap", label: "大会総括", icon: "✍" },
];

export default function HighSchoolLayout() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[10px] tracking-[0.4em] text-jbu-accent">
            HAKKYU NO KISEKI
          </div>
          <h1 className="font-display text-3xl md:text-4xl mt-1 leading-none">
            白球のキセキ — 高校野球DB
          </h1>
          <p className="text-xs text-jbu-muted mt-2">
            JBUのルーツ。重賞大会(G1-G3)・賞金ランキング・全50校のプロフィールを統合。
          </p>
        </div>
      </div>

      <TabBar tabs={TABS} basePath="/highschool" />

      <div>
        <Outlet />
      </div>
    </div>
  );
}
