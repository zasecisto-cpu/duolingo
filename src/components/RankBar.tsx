import React from "react";
import { getRankDetails } from "../lib/gamification";
import type { Lang } from "../lib/i18n";

interface RankBarProps {
  xp: number;
  lang: Lang;
}

export const RankBar: React.FC<RankBarProps> = ({ xp, lang }) => {
  const details = getRankDetails(xp);

  // Překlad hodností pro polštinu
  const translateRank = (name: string): string => {
    if (lang === "cs") return name;
    switch (name) {
      case "Vajíčko": return "Jajko";
      case "Larva": return "Larwa";
      case "Kukla": return "Poczwarka";
      case "Létavka": return "Pszczoła lotna";
      case "Strážkyně úlu": return "Strażniczka ula";
      case "Zkušená včelařka": return "Doświadczona pszczelarka";
      case "Mistr včelař": return "Mistrz pszczelarski";
      default: return name;
    }
  };

  return (
    <div className="rank-bar-container">
      <div className="rank-text-row">
        <div>
          <span className="rank-label-title">
            {lang === "cs" ? "Hodnost" : "Ranga"}:{" "}
          </span>
          <span className="rank-name-value">
            {translateRank(details.currentRank)}
          </span>
        </div>
        <div className="rank-xp-value">
          {details.nextRank ? (
            <span>
              {xp} / {details.maxXp} XP
            </span>
          ) : (
            <span>{xp} XP (MAX)</span>
          )}
        </div>
      </div>

      <div className="rank-progress-outer" title={`${xp} XP`}>
        <div
          className="rank-progress-inner"
          style={{ width: `${details.progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default RankBar;
