import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import YearSelector from "../../components/YearSelector";
import TabBar from "../../components/TabBar";
import { JBU_YEARS, CURRENT_YEAR } from "../../lib/dataService";

const JBU_TABS = [
  { to: "standings", label: "チーム順位", icon: "▤" },
  { to: "cs", label: "CS成績", icon: "◇" },
  { to: "japan-series", label: "日本シリーズ", icon: "★" },
  { to: "titles", label: "表彰・タイトル", icon: "♛" },
  { to: "team-stats", label: "チーム個人成績", icon: "⬢" },
  { to: "draft", label: "ドラフト", icon: "✦" },
  { to: "transactions", label: "入退団", icon: "⇄" },
  { to: "recap", label: "総括・ブログ", icon: "✍" },
];

export default function JbuYearLayout() {
  const { year } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const yearNum = Number(year);
  const isValid = JBU_YEARS.includes(yearNum);

  useEffect(() => {
    if (!isValid) {
      navigate(`/jbu/${CURRENT_YEAR}/standings`, { replace: true });
    }
  }, [isValid, navigate]);

  if (!isValid) return null;

  const onYearChange = (newYear) => {
    const remaining = location.pathname.replace(/^\/jbu\/\d{4}/, "");
    const suffix = remaining || "/standings";
    navigate(`/jbu/${newYear}${suffix}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div>
          <div className="text-[10px] tracking-[0.4em] text-jbu-accent">
            JBU PRO BASEBALL
          </div>
          <h1 className="font-display text-3xl md:text-4xl mt-1 leading-none">
            年度別 シーズンデータ
          </h1>
        </div>
        <YearSelector
          years={JBU_YEARS}
          current={yearNum}
          onChange={onYearChange}
        />
      </div>

      <TabBar tabs={JBU_TABS} basePath={`/jbu/${yearNum}`} />

      <div>
        <Outlet context={{ year: yearNum }} />
      </div>
    </div>
  );
}
