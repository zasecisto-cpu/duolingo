import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import StreakBar from "../components/StreakBar";
import QuestionCard from "../components/QuestionCard";
import OptionCard from "../components/OptionCard";
import FeedbackPanel from "../components/FeedbackPanel";
import Toast from "../components/Toast";
import CtaButton from "../components/CtaButton";
import { shuffleArray } from "../lib/shuffle";
import { t } from "../lib/i18n";
import type { Lang } from "../lib/i18n";

interface RawQuestion {
  q: string;
  options: string[];
  answer: string | number;
  why: string;
}

interface QuizGameProps {
  levelType: "text-choice" | "image-choice";
  rawQuestions: RawQuestion[];
  lang: Lang;
  xp: number;
  streak: number;
  onAnswer: (correct: boolean) => void;
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface PreparedOption {
  text: string;
  isCorrect: boolean;
}

interface PreparedQuestion {
  q: string;
  options: PreparedOption[];
  why: string;
}

export const QuizGame: React.FC<QuizGameProps> = ({
  levelType,
  rawQuestions,
  lang,
  xp,
  streak,
  onAnswer,
  onComplete,
  onBack,
}) => {
  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [praiseText, setPraiseText] = useState<string | null>(null);
  const [correctPool, setCorrectPool] = useState<string[]>([]);
  const [wrongPool, setWrongPool] = useState<string[]>([]);

  // Načtení a příprava (zamíchání) otázek na začátku
  useEffect(() => {
    // 1. Zamíchat pořadí otázek (Fisher-Yates)
    const shuffledQuestions = shuffleArray(rawQuestions);

    // 2. Pro každou otázku zamíchat možnosti a označit správnou
    const prepared = shuffledQuestions.map((q) => {
      const opts = q.options.map((opt, idx) => {
        const isCorrect =
          typeof q.answer === "number"
            ? idx === q.answer
            : opt === q.answer;
        return { text: opt, isCorrect };
      });
      return {
        q: q.q,
        options: shuffleArray(opts),
        why: q.why,
      };
    });

    setQuestions(prepared);
    setCurrentIdx(0);
    setSelectedOptIdx(null);
    setIsAnswered(false);
    setScore(0);
  }, [rawQuestions]);

  if (questions.length === 0) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading...</div>;
  }

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOptIdx(idx);
    setIsAnswered(true);

    const isCorrect = currentQuestion.options[idx].isCorrect;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    
    // Volat handler pro XP a sérii v rodiči
    onAnswer(isCorrect);

    // Načíst a vybrat náhodnou mikropochvalu/povzbuzení (pool bez opakování)
    const praisesData = t("praises", lang);
    if (isCorrect) {
      // Speciální toast pro streak
      if (streak + 1 === 3) {
        setPraiseText(praisesData.streak3);
      } else if (streak + 1 === 5) {
        setPraiseText(praisesData.streak5);
      } else if (streak + 1 === 10) {
        setPraiseText(praisesData.streak10);
      } else {
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

    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      onComplete(score);
    }
  };

  const isCurrentSelectionCorrect = (): boolean => {
    if (selectedOptIdx === null) return false;
    return currentQuestion.options[selectedOptIdx].isCorrect;
  };

  // Titulek panelu a zpráva (při chybě povzbuzující věta, při úspěchu Správně!)
  const getFeedbackTitle = (): string => {
    if (isCurrentSelectionCorrect()) {
      return t("correctTitle", lang);
    }
    return praiseText || t("wrongTitle", lang);
  };

  return (
    <div className="main-content" style={{ padding: 0 }}>
      {/* Plovoucí toast nad feedback panelem */}
      {isAnswered && isCurrentSelectionCorrect() && praiseText && (
        <Toast message={praiseText} onClose={() => setPraiseText(null)} />
      )}

      {/* TopBar s progressem a Close tlačítkem */}
      <TopBar
        currentStep={currentIdx + 1}
        totalSteps={totalQuestions}
        xp={xp}
        onClose={onBack}
      />

      {/* Streak tečky */}
      <StreakBar streak={streak} lang={lang} />

      <div style={{ padding: "0 20px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <QuestionCard
          currentStep={currentIdx + 1}
          totalSteps={totalQuestions}
          questionText={currentQuestion.q}
          lang={lang}
        />

        {/* Mřížka/Seznam odpovědí */}
        <div className={levelType === "image-choice" ? "image-options-grid" : "options-grid"}>
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOptIdx === idx;
            let cardState: "default" | "correct" | "wrong" | "dimmed" = "default";

            if (isAnswered) {
              if (opt.isCorrect) {
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
                text={opt.text}
                selected={isSelected}
                disabled={isAnswered}
                state={cardState}
                type={levelType}
                index={idx}
                onClick={() => handleSelectOption(idx)}
              />
            );
          })}
        </div>

        {/* Vyhodnocovací / Feedback Panel a CTA */}
        <div style={{ marginTop: "auto" }}>
          {isAnswered ? (
            <>
              <FeedbackPanel
                correct={isCurrentSelectionCorrect()}
                title={getFeedbackTitle()}
                why={currentQuestion.why}
              />
              <div style={{ marginTop: "12px" }}>
                <CtaButton
                  text={currentIdx + 1 === totalQuestions ? t("finish", lang) : t("continue", lang)}
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

export default QuizGame;
