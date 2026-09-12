import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";

import YearPortalLayout from "./pages/YearPortalLayout";
import TopTab from "./pages/year/TopTab";
import ArticlesTab from "./pages/year/ArticlesTab";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Draft from "./pages/jbu/Draft";
import TeamStats from "./pages/jbu/TeamStats";
import Transactions from "./pages/jbu/Transactions";

// Legacy year layout & its sub-pages are kept so old /jbu/:year/* URLs still
// work for bookmarks. New nav points at /y/:year.
import JbuYearLayout from "./pages/jbu/JbuYearLayout";
import Standings from "./pages/jbu/Standings";
import ClimaxSeries from "./pages/jbu/ClimaxSeries";
import JapanSeries from "./pages/jbu/JapanSeries";
import Awards from "./pages/jbu/Awards";
import Recap from "./pages/jbu/Recap";
import AllTimeRecords from "./pages/jbu/AllTimeRecords";

import HighSchoolLayout from "./pages/highschool/HighSchoolLayout";
import Tournaments from "./pages/highschool/Tournaments";
import PrizeRanking from "./pages/highschool/PrizeRanking";
import Schools from "./pages/highschool/Schools";
import TournamentRecaps from "./pages/highschool/TournamentRecaps";

import { CURRENT_YEAR, LATEST_YEAR } from "./lib/dataService";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Home → year portal at the newest season across both eras (2042+) */}
          <Route
            path="/"
            element={<Navigate to={`/y/${LATEST_YEAR}`} replace />}
          />

          {/* New year portal */}
          <Route path="/y/:year" element={<YearPortalLayout />}>
            <Route index element={<TopTab />} />
            <Route path="articles" element={<ArticlesTab />} />
            <Route path="draft" element={<Draft />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="stats" element={<TeamStats />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Route>

          {/* Global pages */}
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/records" element={<AllTimeRecords />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />

          {/* Legacy JBU routes — kept for back-compat */}
          <Route
            path="/jbu"
            element={<Navigate to={`/y/${CURRENT_YEAR}`} replace />}
          />
          <Route path="/jbu/records" element={<AllTimeRecords />} />
          <Route path="/jbu/:year" element={<JbuYearLayout />}>
            <Route index element={<Navigate to="standings" replace />} />
            <Route path="standings" element={<Standings />} />
            <Route path="cs" element={<ClimaxSeries />} />
            <Route path="japan-series" element={<JapanSeries />} />
            <Route path="titles" element={<Awards />} />
            <Route path="team-stats" element={<TeamStats />} />
            <Route path="draft" element={<Draft />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="recap" element={<Recap />} />
          </Route>

          {/* High school routes */}
          <Route
            path="/highschool"
            element={<Navigate to="/highschool/tournaments" replace />}
          />
          <Route path="/highschool" element={<HighSchoolLayout />}>
            <Route path="tournaments" element={<Tournaments />} />
            <Route path="prize-ranking" element={<PrizeRanking />} />
            <Route path="schools" element={<Schools />} />
            <Route path="recap" element={<TournamentRecaps />} />
          </Route>

          {/* Legacy redirects */}
          <Route
            path="/drafts"
            element={<Navigate to={`/y/${CURRENT_YEAR}/draft`} replace />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
