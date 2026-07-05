import React from "react";
import { t } from "../lib/i18n";
import type { Lang } from "../lib/i18n";
import { BADGES } from "../lib/gamification";
import CtaButton from "./CtaButton";

interface ResultScreenProps {
  levelId: string;
  score: number;
  maxScore: number;
  xpEarned: number;
  streakEarned: number;
  honeyEarned?: number;
  newlyUnlockedBadgeId?: string | null;
  lang: Lang;
  onPlayAgain: () => void;
  onBackToMap: () => void;
  onNextLevel?: () => void;
  onShare: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  levelId,
  score,
  maxScore,
  xpEarned,
  streakEarned,
  honeyEarned,
  newlyUnlockedBadgeId,
  lang,
  onPlayAgain,
  onBackToMap,
  onNextLevel,
  onShare,
}) => {
  const isSuccess = score / maxScore >= 0.8;

  // Funkce pro získání titulu
  const getPlayerTitle = (): string => {
    const pct = score / maxScore;
    if (levelId === "rok") {
      if (score >= 6) {
        return lang === "cs" ? "Rozený včelař" : "Urodzony pszczelarz";
      }
      if (score >= 4) {
        return lang === "cs" ? "Nadějný začátečník" : "Obiecujący początkujący";
      }
      return lang === "cs" ? "Medvěd v úlu" : "Niedźwiedź w ulu";
    }

    if (pct >= 0.9) {
      return lang === "cs" ? "Znalec úlu" : "Znawca ula";
    }
    if (pct >= 0.6) {
      return lang === "cs" ? "Slibná mladuška" : "Obiecująca pszczoła";
    }
    return lang === "cs" ? "Čerstvě vylíhnutá včela" : "Świeżo wykluta pszczoła";
  };

  // Získat detail odznaku pro zobrazení
  const newlyUnlockedBadge = newlyUnlockedBadgeId
    ? BADGES.find((b) => b.id === newlyUnlockedBadgeId)
    : null;

  // Ikona medaile (trofej)
  const renderMedalIcon = () => (
    <svg viewBox="0 0 24 24" style={{ width: "100%", height: "100%" }}>
      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.21 1.79 4 4 4h2.5c.9 1.74 2.5 3 4.5 3v3H9v2h6v-2h-5v-3c2-.3 3.6-1.56 4.5-3H17c2.21 0 4-1.79 4-4V7c0-1.1-.9-2-2-2zM5 10V7h2v3c0 1.1-.9 2-2 2s-2-.9-2-2zm14 0c0 1.1-.9 2-2 2s-2-.9-2-2V7h2v3z" />
    </svg>
  );

  // Ikona odznaku
  const renderBadgeSvg = (iconName: string) => {
    // Jednoduché outlines pro ikony odznaků
    switch (iconName) {
      case "check":
        return <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />;
      case "eye":
        return <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />;
      case "star":
        return <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />;
      case "trophy":
        return <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.21 1.79 4 4 4h2.5c.9 1.74 2.5 3 4.5 3v3H9v2h6v-2h-5v-3c2-.3 3.6-1.56 4.5-3H17c2.21 0 4-1.79 4-4V7c0-1.1-.9-2-2-2z" />;
      case "calendar":
        return <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />;
      case "droplet":
        return <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />;
      case "flame":
        return <path d="M12 2c-.5 0-1 1-1 2.5S11.5 7 12 7s1-1 1-2.5S12.5 2 12 2zm1 17h-2v-2h2v2z" />;
      case "activity":
        return <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />;
      case "crown":
        return <path d="M5 16h14v2H5zm14-8l-3.5 3.5L12 5l-3.5 6.5L5 8l1.5 6h11z" />;
      default:
        return <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />;
    }
  };

  return (
    <div className="result-screen-wrapper">
      {/* Padající konfety */}
      {isSuccess && (
        <div className="confetti-overlay-wrapper">
          {Array.from({ length: 15 }).map((_, idx) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            const duration = 1.8 + Math.random() * 1.5;
            const colors = ["#58CC02", "#FF9600", "#1CB0F6", "#FF4B4B", "#EF9F27"];
            const color = colors[idx % colors.length];
            return (
              <div
                key={idx}
                className="confetti-piece"
                style={{
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  backgroundColor: color,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Velká animovaná medaile */}
      <div className="medal-box">{renderMedalIcon()}</div>

      {/* Titul a úspěšnost */}
      <div style={{ marginTop: "10px" }}>
        <h1 className="result-heading">{getPlayerTitle()}</h1>
        <p className="result-message-text">
          {lang === "cs"
            ? "Skvělá práce! Včelstvo prosperuje a má velkou radost z tvých znalostí."
            : "Świetna robota! Rodzina pszczela rozwija się i cieszy z twojej wiedzy."}
        </p>
      </div>

      {/* Řádek statistik */}
      <div className="stats-panel-row">
        <div className="stat-box-card">
          <span className="stat-box-value" style={{ color: "var(--green)" }}>
            {score} / {maxScore}
          </span>
          <span className="stat-box-label">{t("score", lang)}</span>
        </div>

        <div className="stat-box-card">
          <span className="stat-box-value" style={{ color: "var(--orange)" }}>
            +{xpEarned}
          </span>
          <span className="stat-box-label">XP</span>
        </div>

        <div className="stat-box-card">
          <span className="stat-box-value" style={{ color: "var(--orange)" }}>
            {honeyEarned !== undefined ? `${honeyEarned} kg` : streakEarned}
          </span>
          <span className="stat-box-label">
            {honeyEarned !== undefined 
              ? (lang === "cs" ? "Medu" : "Miodu")
              : (lang === "cs" ? "Série" : "Seria")}
          </span>
        </div>
      </div>

      {/* Odemčený odznak */}
      {newlyUnlockedBadge && (
        <div className="new-badge-unlocked-showcase">
          <div className="badge-icon-box">
            <svg viewBox="0 0 24 24" width="30" height="30">
              {renderBadgeSvg(newlyUnlockedBadge.icon)}
            </svg>
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--green-dark)", textTransform: "uppercase" }}>
              {t("newBadgeUnlocked", lang)}
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800 }}>
              {newlyUnlockedBadge.name}
            </div>
            <div style={{ fontSize: "12px", color: "#555" }}>
              {newlyUnlockedBadge.desc}
            </div>
          </div>
        </div>
      )}

      {/* Akce */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
        <CtaButton text={t("playAgain", lang)} onClick={onPlayAgain} />

        <button
          onClick={onShare}
          className="cta-button secondary"
          style={{ width: "100%" }}
        >
          {t("shareResult", lang)}
        </button>

        {onNextLevel && (
          <button
            onClick={onNextLevel}
            className="cta-button secondary"
            style={{ width: "100%", borderColor: "var(--green)", color: "var(--green-dark)" }}
          >
            {t("nextLevel", lang)}
          </button>
        )}

        <button
          onClick={onBackToMap}
          className="cta-button secondary"
          style={{ width: "100%" }}
        >
          {t("backToMap", lang)}
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
