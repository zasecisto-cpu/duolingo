import React, { useState } from "react";
import TopBar from "../components/TopBar";
import StreakBar from "../components/StreakBar";
import OptionCard from "../components/OptionCard";
import FeedbackPanel from "../components/FeedbackPanel";
import Toast from "../components/Toast";
import CtaButton from "../components/CtaButton";
import { t } from "../lib/i18n";
import type { Lang } from "../lib/i18n";
import { shuffleArray } from "../lib/shuffle";

interface Option {
  label: string;
  effects: {
    sila: number;
    zasoby: number;
    rojeni: number;
    med: number;
  };
  correct: boolean;
  why: string;
}

interface MonthData {
  month: string;
  text: string;
  options: Option[];
}

interface SeasonGameProps {
  data: {
    id: string;
    title: string;
    months: MonthData[];
  };
  lang: Lang;
  xp: number;
  streak: number;
  onAnswer: (correct: boolean) => void;
  onComplete: (
    score: number,
    finalStats?: {
      sila: number;
      zasoby: number;
      med: number;
      finalYield: number;
      survived: boolean;
    }
  ) => void;
  onBack: () => void;
}

export const SeasonGame: React.FC<SeasonGameProps> = ({
  data,
  lang,
  xp,
  streak,
  onAnswer,
  onComplete,
  onBack,
}) => {
  // Stav zdrojů
  const [sila, setSila] = useState(60);
  const [zasoby, setZasoby] = useState(60);
  const [rojeni, setRojeni] = useState(20);
  const [med, setMed] = useState(0);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [praiseText, setPraiseText] = useState<string | null>(null);
  const [swarmedThisTurn, setSwarmedThisTurn] = useState(false);
  const [correctPool, setCorrectPool] = useState<string[]>([]);
  const [wrongPool, setWrongPool] = useState<string[]>([]);

  const months = data.months;
  const currentMonth = months[currentIdx];
  const totalMonths = months.length;

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;

    setSelectedOptIdx(optIdx);
    setIsAnswered(true);
    setSwarmedThisTurn(false);

    const option = currentMonth.options[optIdx];
    const isCorrect = option.correct;

    if (isCorrect) {
      setScore((s) => s + 1);
    }

    onAnswer(isCorrect);

    // Výpočet nových zdrojů
    let newSila = Math.max(0, Math.min(100, sila + option.effects.sila));
    let newZasoby = Math.max(0, Math.min(100, zasoby + option.effects.zasoby));
    let newRojeni = Math.max(0, Math.min(100, rojeni + option.effects.rojeni));
    let newMed = Math.max(0, med + option.effects.med);

    // Kontrola vyrojení (rojeni >= 100)
    if (newRojeni >= 100) {
      setSwarmedThisTurn(true);
      newSila = Math.max(0, newSila - 30);
      newMed = Math.max(0, newMed - 15);
      newRojeni = 40;
    }

    setSila(newSila);
    setZasoby(newZasoby);
    setRojeni(newRojeni);
    setMed(newMed);

    // Získat mikropochvalu (pool bez opakování)
    const praisesData = t("praises", lang);
    if (isCorrect) {
      if (streak + 1 === 3) setPraiseText(praisesData.streak3);
      else if (streak + 1 === 5) setPraiseText(praisesData.streak5);
      else if (streak + 1 === 10) setPraiseText(praisesData.streak10);
      else {
        let pool = [...correctPool];
        if (pool.length === 0) {
          pool = shuffleArray([...praisesData.correct]);
        }
        const msg = pool.pop()!;
        setCorrectPool(pool);
        setPraiseText(msg);
      }
    } else {
      let pool = [...wrongPool];
      if (pool.length === 0) {
        pool = shuffleArray([...praisesData.wrong]);
      }
      const msg = pool.pop()!;
      setWrongPool(pool);
      setPraiseText(msg);
    }
  };

  const handleContinue = () => {
    setIsAnswered(false);
    setSelectedOptIdx(null);
    setPraiseText(null);
    setSwarmedThisTurn(false);

    // Ověřit, zda včelstvo přežilo
    if (sila <= 0 || zasoby <= 0) {
      const finalYield = Math.max(0, Math.round(med + sila * 0.2 + zasoby * 0.1));
      onComplete(score, {
        sila,
        zasoby,
        med,
        finalYield,
        survived: false,
      });
      return;
    }

    if (currentIdx + 1 < totalMonths) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      // Úspěšný konec roku
      const finalYield = Math.max(0, Math.round(med + sila * 0.2 + zasoby * 0.1));
      onComplete(score, {
        sila,
        zasoby,
        med,
        finalYield,
        survived: true,
      });
    }
  };

  const isCurrentSelectionCorrect = (): boolean => {
    if (selectedOptIdx === null) return false;
    return currentMonth.options[selectedOptIdx].correct;
  };

  const getFeedbackTitle = (): string => {
    if (isCurrentSelectionCorrect()) {
      return t("correctTitle", lang);
    }
    return praiseText || t("wrongTitle", lang);
  };

  const getFeedbackExplanation = (): string => {
    let explanation = "";
    if (selectedOptIdx !== null) {
      explanation = currentMonth.options[selectedOptIdx].why;
    }
    if (swarmedThisTurn) {
      explanation += `\n\n🚨 ${t("swarmedAlertTitle", lang)}: ${t("swarmedAlertDesc", lang)}`;
    }
    return explanation;
  };

  return (
    <div className="main-content" style={{ padding: 0 }}>
      {isAnswered && isCurrentSelectionCorrect() && praiseText && (
        <Toast message={praiseText} onClose={() => setPraiseText(null)} />
      )}

      <TopBar
        currentStep={currentIdx + 1}
        totalSteps={totalMonths}
        xp={xp}
        onClose={onBack}
      />

      <StreakBar streak={streak} lang={lang} />

      <div className="game-content-area">
        <div className="game-scroll-area">
          {/* Stavové lišty pro včelaře */}
          <div className="season-stats-container" style={{ marginTop: "10px" }}>
            {/* Síla včelstva */}
            <div className="season-stat-progress-row">
              <div className="season-progress-header">
                <span>{t("strength", lang)}</span>
                <span>{sila}%</span>
              </div>
              <div className="season-progress-outer">
                <div className="season-progress-inner sila" style={{ width: `${sila}%` }} />
              </div>
            </div>

            {/* Zásoby */}
            <div className="season-stat-progress-row">
              <div className="season-progress-header">
                <span>{t("supplies", lang)}</span>
                <span>{zasoby}%</span>
              </div>
              <div className="season-progress-outer">
                <div className="season-progress-inner zasoby" style={{ width: `${zasoby}%` }} />
              </div>
            </div>

            {/* Rojivost */}
            <div className="season-stat-progress-row">
              <div className="season-progress-header">
                <span>{t("swarming", lang)}</span>
                <span>{rojeni}%</span>
              </div>
              <div className="season-progress-outer">
                <div className="season-progress-inner rojeni" style={{ width: `${rojeni}%` }} />
              </div>
            </div>

            {/* Med ve skladu */}
            <div className="season-honey-counter">
              {t("honeyYield", lang)}: {med} kg
            </div>
          </div>

          {/* Instrukční / Popisná karta měsíce */}
          <div className="season-description">
            <span className="season-month-label">
              {t("month", lang)}: {currentMonth.month}
            </span>
            <p className="season-text-content">{currentMonth.text}</p>
          </div>

          {/* Možnosti volby */}
          <div className="options-grid" style={{ marginBottom: "20px" }}>
            {currentMonth.options.map((opt, idx) => {
              const isSelected = selectedOptIdx === idx;
              let cardState: "default" | "correct" | "wrong" | "dimmed" = "default";

              if (isAnswered) {
                if (opt.correct) {
                  cardState = "correct";
                } else if (isSelected) {
                  cardState = "wrong";
                } else {
                  cardState = "dimmed";
                }
              }

              return (
                <OptionCard
                  key={idx}
                  text={opt.label}
                  selected={isSelected}
                  disabled={isAnswered}
                  state={cardState}
                  type="text-choice"
                  index={idx}
                  onClick={() => handleSelectOption(idx)}
                />
              );
            })}
          </div>
        </div>

        {/* Spodní vyhodnocení v pevné patičce */}
        <div className="game-footer-area">
          {isAnswered ? (
            <>
              <FeedbackPanel
                correct={isCurrentSelectionCorrect()}
                title={getFeedbackTitle()}
                why={getFeedbackExplanation()}
              />
              <div style={{ marginTop: "12px" }}>
                <CtaButton
                  text={currentIdx + 1 === totalMonths ? t("finish", lang) : t("continue", lang)}
                  onClick={handleContinue}
                  correctState={isCurrentSelectionCorrect()}
                />
              </div>
            </>
          ) : (
            <CtaButton
              text={t("continue", lang)}
              onClick={() => {}}
              disabled={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SeasonGame;
