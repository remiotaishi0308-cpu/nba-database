import { NavLink } from "react-router-dom";

export default function TabBar({ tabs, basePath, end = false }) {
  return (
    <div className="border-b border-jbu-border overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {tabs.map((t) => {
          const to = t.to.startsWith("/")
            ? t.to
            : `${basePath}/${t.to}`.replace(/\/+$/, "");
          return (
            <NavLink
              key={t.to}
              to={to}
              end={end || t.end}
              className={({ isActive }) =>
                [
                  "relative px-4 py-2.5 text-sm whitespace-nowrap transition-colors",
                  isActive
                    ? "text-jbu-accent"
                    : "text-jbu-muted hover:text-jbu-text",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-1.5">
                    {t.icon && <span className="opacity-70">{t.icon}</span>}
                    {t.label}
                  </span>
                  <span
                    className={`absolute left-0 right-0 -bottom-px h-0.5 transition-all ${
                      isActive ? "bg-jbu-accent" : "bg-transparent"
                    }`}
                  />
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
