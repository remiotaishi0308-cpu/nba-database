import { useEffect, useState } from "react";

// Reusable team-identity chip.
// Renders the team's logo image when team.logoUrl is set; falls back to the
// team's single-letter "logo" field (or first character of shortName) on error.

const SIZES = {
  sm: { box: "w-5 h-5", text: "text-[10px]" },
  md: { box: "w-8 h-8", text: "text-sm" },
  lg: { box: "w-12 h-12", text: "text-base" },
  xl: { box: "w-20 h-20", text: "text-3xl" },
};

export default function TeamBadge({ team, size = "sm", shape = "circle" }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [team?.id, team?.logoUrl]);

  if (!team) return null;

  const s = SIZES[size] ?? SIZES.sm;
  const radius = shape === "circle" ? "rounded-full" : "rounded-md";
  const fallback = team.logo || team.shortName?.[0] || "?";

  if (team.logoUrl && !imgError) {
    return (
      <span
        className={`${s.box} ${radius} inline-flex items-center justify-center overflow-hidden shrink-0 bg-jbu-surface-2 border`}
        style={{ borderColor: team.primaryColor }}
      >
        <img
          src={team.logoUrl}
          alt={team.shortName}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className={`${s.box} ${s.text} ${radius} inline-flex items-center justify-center font-display font-bold tracking-tight shrink-0`}
      style={{
        background: team.primaryColor,
        color: team.secondaryColor,
        border: `1px solid ${team.primaryColor}`,
      }}
      aria-label={team.shortName}
    >
      {fallback}
    </span>
  );
}

export function TeamColorBar({ team, className = "" }) {
  if (!team) return null;
  return (
    <span
      className={`inline-block w-1 h-5 rounded-sm align-middle ${className}`}
      style={{ background: team.primaryColor }}
    />
  );
}
