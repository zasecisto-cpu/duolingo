import React from "react";
import { t } from "../lib/i18n";
import type { Lang } from "../lib/i18n";

interface QuestionCardProps {
  currentStep: number;
  totalSteps: number;
  questionText: string;
  lang: Lang;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  currentStep,
  totalSteps,
  questionText,
  lang,
}) => {
  const label = t("questionLabel", lang, { n: currentStep, m: totalSteps });

  return (
    <div className="question-card">
      <div className="question-card-label">{label}</div>
      <h2 className="question-text">{questionText}</h2>
    </div>
  );
};

export default QuestionCard;
