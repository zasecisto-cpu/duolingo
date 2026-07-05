import React from "react";
import type { Lang } from "../lib/i18n";

interface StreakBarProps {
  streak: number;
  lang: Lang;
}

export const StreakBar: React.FC<StreakBarProps> = ({ streak, lang }) => {
  // Vykreslit max 5 teček, pokud je streak vyšší než 5, svítí všech 5
  const activeDotsCount = Math.min(5, streak);

  return (
    <div className="streak-bar">
      <div className="streak-dots" title={`Série: ${streak}`}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className={`streak-dot ${idx < activeDotsCount ? "active" : ""}`}
          />
        ))}
      </div>

      {streak > 0 && (
        <div className="streak-number-wrapper">
          <span>{streak} {lang === "cs" ? "v řadě" : "z rzędu"}</span>
          <svg viewBox="0 0 24 24" className="flame-icon">
            <path d="M12 2c-.5 0-1 1-1 2.5S11.5 7 12 7s1-1 1-2.5S12.5 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75zM13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73C7.2 3.4 8.7 1 8.7 1s4.8 2.37 4.8 4.47c0 1.04-.59 1.9-1.5 2.15.54.1 1.03-.23 1.03-.78 0-.82-.53-1.63-.53-1.63s2 1.34 2 2.87c0 1.65-1.35 3-3 3s-3-1.35-3-3" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default StreakBar;
