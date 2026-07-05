import React from "react";
import { t } from "../lib/i18n";
import type { Lang } from "../lib/i18n";
import type { BeeProgress } from "../lib/progress";

interface LevelMapProps {
  progress: BeeProgress;
  onSelectLevel: (levelId: string, topicId?: string | null) => void;
  onOpenBadges: () => void;
  onTriggerEmailGate: () => void;
  lang: Lang;
}

export const LevelMap: React.FC<LevelMapProps> = ({
  progress,
  onSelectLevel,
  onOpenBadges,
  onTriggerEmailGate,
  lang,
}) => {
  const isL1Done = progress.levels.skolka?.done || false;
  const isL2Done = progress.levels.plast?.done || false;

  const isL2Unlocked = isL1Done;
  const isL3Unlocked = isL2Done;

  const hasEmail = !!progress.email;

  // Výpočet hvězdiček na základě skóre
  const getStarsCount = (score: number, maxScore: number): number => {
    if (score === 0) return 0;
    const ratio = score / maxScore;
    if (ratio === 1) return 3;
    if (ratio >= 0.7) return 2;
    if (ratio >= 0.4) return 1;
    return 0;
  };

  const handleLevelClick = (levelId: string) => {
    if (levelId === "skolka") {
      onSelectLevel("skolka", null);
    } else if (levelId === "plast") {
      if (!isL2Unlocked) return;
      if (!hasEmail) {
        onTriggerEmailGate();
      } else {
        onSelectLevel("plast", null);
      }
    } else if (levelId === "rok") {
      if (!isL3Unlocked) return;
      onSelectLevel("rok", null);
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="level-stars">
        {Array.from({ length: 3 }).map((_, idx) => (
          <svg
            key={idx}
            viewBox="0 0 24 24"
            className={`star-icon ${idx < count ? "filled" : ""}`}
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  };

  // Definice 6 tematických okruhů
  const extraTopics = [
    { id: "biologie", icon: "lupa", nameCs: "Biologie včely", namePl: "Biologia pszczoły", count: 15, color: "#FFF0D4" },
    { id: "zivot", icon: "domecek", nameCs: "Život úlu", namePl: "Życie ula", count: 15, color: "#FFE6E6" },
    { id: "produkty", icon: "kapka", nameCs: "Včelí produkty", namePl: "Produkty pszczele", count: 15, color: "#E6F7FF" },
    { id: "zdravi", icon: "stit", nameCs: "Zdraví včel", namePl: "Zdrowie pszczół", count: 15, color: "#D7FFB8" },
    { id: "praxe", icon: "kufrik", nameCs: "Praxe a výbava", namePl: "Praktyka i sprzęt", count: 15, color: "#FFF0D4" },
    { id: "zacatek", icon: "vlajecka", nameCs: "Začínáme", namePl: "Zacząć", count: 20, color: "#FFE6E6" },
  ];

  const renderTopicIcon = (icon: string) => {
    switch (icon) {
      case "lupa":
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--orange)">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        );
      case "domecek":
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--red)">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        );
      case "kapka":
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--blue)">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        );
      case "stit":
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--green-dark)">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
          </svg>
        );
      case "kufrik":
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--orange)">
            <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm11 15H4V8h16v11z" />
          </svg>
        );
      case "vlajecka":
        return (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--red)">
            <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Sub-header s názvem a navigací do sbírky */}
      <div className="map-header">
        <h2 className="map-header-title">{t("levelMap", lang)}</h2>
        <button onClick={onOpenBadges} className="badges-nav-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          {t("badgesCollection", lang)}
        </button>
      </div>

      {/* Tři velké dlaždice levelů */}
      <div className="level-tiles-container">
        {/* Level 1: Včelí školka */}
        <button
          onClick={() => handleLevelClick("skolka")}
          className={`level-tile ${progress.levels.skolka?.done ? "completed" : ""}`}
        >
          <div className="level-tile-icon-box">
            <svg viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            </svg>
          </div>
          <div className="level-tile-info">
            <h3 className="level-tile-title">
              {lang === "cs" ? "Level 1: Včelí školka" : "Poziom 1: Przedszkole"}
            </h3>
            <span className="level-tile-subtitle">
              {lang === "cs" ? "Poznej základy" : "Poznaj podstawy"}
            </span>
            {renderStars(getStarsCount(progress.levels.skolka?.best || 0, 15))}
          </div>
        </button>

        {/* Level 2: Čtení plástu */}
        <button
          onClick={() => handleLevelClick("plast")}
          className={`level-tile ${
            !isL2Unlocked ? "locked" : progress.levels.plast?.done ? "completed" : ""
          }`}
        >
          <div className="level-tile-icon-box">
            <svg viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" />
            </svg>
          </div>
          <div className="level-tile-info">
            <h3 className="level-tile-title">
              {lang === "cs" ? "Level 2: Čtení plástu" : "Poziom 2: Czytanie plastra"}
            </h3>
            <span className="level-tile-subtitle">
              {lang === "cs" ? "Rozpoznej plást" : "Rozpoznaj plaster"}
            </span>
            {isL2Unlocked ? (
              renderStars(getStarsCount(progress.levels.plast?.best || 0, 6))
            ) : (
              <span className="level-tile-subtitle" style={{ color: "var(--red)" }}>
                {t("locked", lang)}
              </span>
            )}
          </div>
          {!isL2Unlocked && (
            <div className="tile-lock-overlay">
              <svg viewBox="0 0 24 24" className="tile-lock-icon">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </div>
          )}
        </button>

        {/* Level 3: Včelařův rok */}
        <button
          onClick={() => handleLevelClick("rok")}
          className={`level-tile ${
            !isL3Unlocked ? "locked" : progress.levels.rok?.done ? "completed" : ""
          }`}
        >
          <div className="level-tile-icon-box">
            <svg viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
          <div className="level-tile-info">
            <h3 className="level-tile-title">
              {lang === "cs" ? "Level 3: Včelařův rok" : "Poziom 3: Rok pszczelarza"}
            </h3>
            <span className="level-tile-subtitle">
              {lang === "cs" ? "Sezónní rozhodnutí" : "Sezonowe decyzje"}
            </span>
            {isL3Unlocked ? (
              renderStars(getStarsCount(progress.levels.rok?.best || 0, 7))
            ) : (
              <span className="level-tile-subtitle" style={{ color: "var(--red)" }}>
                {t("locked", lang)}
              </span>
            )}
          </div>
          {!isL3Unlocked && (
            <div className="tile-lock-overlay">
              <svg viewBox="0 0 24 24" className="tile-lock-icon">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Sekce "Tematické okruhy" */}
      <h4 className="topics-section-title">{t("extraTopicsTitle", lang)}</h4>
      <div className="topics-grid">
        {extraTopics.map((topic) => {
          const name = lang === "cs" ? topic.nameCs : topic.namePl;
          return (
            <button
              key={topic.id}
              onClick={() => onSelectLevel("skolka", topic.id)}
              className="topic-tile"
              type="button"
            >
              <div
                className="topic-tile-icon-box"
                style={{ backgroundColor: topic.color }}
              >
                {renderTopicIcon(topic.icon)}
              </div>
              <div>
                <h3 className="topic-tile-title">{name}</h3>
                <span className="topic-tile-count">
                  {topic.count} {lang === "cs" ? "otázek" : "pytań"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelMap;
