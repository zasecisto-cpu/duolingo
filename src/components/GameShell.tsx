import React from "react";
import { t } from "../lib/i18n";
import type { Lang } from "../lib/i18n";

interface GameShellProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  score: number;
  streak: number;
  onBack: () => void;
  lang: Lang;
  children: React.ReactNode;
}

export const GameShell: React.FC<GameShellProps> = ({
  title,
  currentStep,
  totalSteps,
  score,
  streak,
  onBack,
  lang,
  children,
}) => {
  const progressPercent = Math.min(
    100,
    Math.max(0, (currentStep / totalSteps) * 100)
  );

  return (
    <div className="game-shell">
      <header className="game-header">
        <div className="game-header-top">
          <button onClick={onBack} className="back-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            {t("backToMap", lang)}
          </button>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {streak > 0 && (
              <div className="streak-indicator" title={`${streak} v řadě`}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--error-orange)">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73C7.2 3.4 8.7 1 8.7 1s4.8 2.37 4.8 4.47c0 1.04-.59 1.9-1.5 2.15.54.1 1.03-.23 1.03-.78 0-.82-.53-1.63-.53-1.63s2 1.34 2 2.87c0 1.65-1.35 3-3 3s-3-1.35-3-3" />
                </svg>
                {t("streak", lang)}: {streak}
              </div>
            )}
            <div className="game-header-score">
              {t("score", lang)}: {score}
            </div>
          </div>
        </div>
        <div className="game-header-title">{title}</div>
        <div className="progress-bar-container" title={`${currentStep} / ${totalSteps}`}>
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>
      <main className="game-content">{children}</main>
    </div>
  );
};
export default GameShell;
