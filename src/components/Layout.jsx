import { Outlet } from "react-router-dom";
import Header from "./Header";

// グローバルナビ（旧サイドバー）は現在すべて非表示のため、サイドバー列は
// 描画せずメインを全幅化している。ナビを上部ヘッダーへ移設する際は Header を
// 拡張し、定義は components/Sidebar.jsx の buildNav() を再利用できる。
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col text-jbu-text">
      <Header />
      <main className="flex-1 px-4 md:px-8 py-6 max-w-[1760px] w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
