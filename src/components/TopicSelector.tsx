import React from "react";
import { t } from "../lib/i18n";
import type { Lang } from "../lib/i18n";

interface Topic {
  id: string;
  name: string;
  icon: string;
  color: string;
  questionCount: number;
}

interface TopicSelectorProps {
  onSelectTopic: (topicId: string) => void;
  onBack: () => void;
  lang: Lang;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  onSelectTopic,
  onBack,
  lang,
}) => {
  const topics: Topic[] = [
    {
      id: "original",
      name: t("originalQuiz", lang),
      icon: "klobouk",
      color: "var(--honey-light)",
      questionCount: 15,
    },
    {
      id: "biologie",
      name: lang === "cs" ? "Biologie včely" : "Biologia pszczoły",
      icon: "lupa",
      color: "var(--honey-light)",
      questionCount: 15,
    },
    {
      id: "zivot",
      name: lang === "cs" ? "Život úlu a rojení" : "Życie ula i rójka",
      icon: "domecek",
      color: "#FCEFEA", // Coral light
      questionCount: 15,
    },
    {
      id: "produkty",
      name: lang === "cs" ? "Med a včelí produkty" : "Miód i produkty pszczele",
      icon: "kapka",
      color: "#FFF9E6", // Amber light
      questionCount: 15,
    },
    {
      id: "zdravi",
      name: lang === "cs" ? "Zdraví včel a nemoci" : "Zdrowie pszczół i choroby",
      icon: "stit",
      color: "#EBF6F3", // Teal light
      questionCount: 15,
    },
    {
      id: "praxe",
      name: lang === "cs" ? "Praxe a vybavení" : "Praktyka i sprzęt",
      icon: "kufrik",
      color: "#EBF3F8", // Blue light
      questionCount: 15,
    },
    {
      id: "zacatek",
      name: lang === "cs" ? "Začínáme a povinnosti" : "Zacząć i obowiązki",
      icon: "vlajecka",
      color: "#ECF6EB", // Green light
      questionCount: 20,
    },
    {
      id: "mix",
      name: t("randomMix", lang),
      icon: "blesk",
      color: "#FFF4DB", // Golden light
      questionCount: 10,
    },
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "klobouk":
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" fill="var(--honey-color)">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5.82 12.9L12 16.27l6.18-3.37v2.22l-6.18 3.38-6.18-3.38v-2.22z" />
          </svg>
        );
      case "lupa":
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" fill="var(--honey-color)">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        );
      case "domecek":
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" fill="var(--error-orange)">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        );
      case "kapka":
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#D4AF37">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        );
      case "stit":
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" fill="var(--correct-green)">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
          </svg>
        );
      case "kufrik":
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#3182CE">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-8-2h4v2h-4V4zm8 15H4V8h16v11z" />
          </svg>
        );
      case "vlajecka":
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#38A169">
            <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
          </svg>
        );
      case "blesk":
        return (
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#E53E3E">
            <path d="M7 2v11h3v9l7-12h-4l4-8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getBorderColor = (icon: string) => {
    if (icon === "lupa" || icon === "klobouk") return "var(--honey-color)";
    if (icon === "domecek") return "var(--error-orange)";
    if (icon === "kapka") return "#D4AF37";
    if (icon === "stit") return "var(--correct-green)";
    if (icon === "kufrik") return "#3182CE";
    if (icon === "vlajecka") return "#38A169";
    return "#E53E3E";
  };

  return (
    <div className="topic-screen">
      <header className="game-header">
        <div className="game-header-top">
          <button onClick={onBack} className="back-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            {t("backToMap", lang)}
          </button>
        </div>
        <div className="game-header-title">{t("selectTopic", lang)}</div>
      </header>

      <main className="topic-list-container">
        <div className="topic-grid">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTopic(t.id)}
              className="topic-card"
              style={{
                backgroundColor: t.color,
                borderColor: getBorderColor(t.icon),
              }}
            >
              <div className="topic-card-icon">{renderIcon(t.icon)}</div>
              <div className="topic-card-info">
                <h3>{t.name}</h3>
                <span className="topic-card-count">
                  {t.questionCount} {lang === "cs" ? "otázek" : "pytań"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};
export default TopicSelector;
