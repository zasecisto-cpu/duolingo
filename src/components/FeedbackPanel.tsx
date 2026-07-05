import React from "react";

interface FeedbackPanelProps {
  correct: boolean;
  title: string; // "Správně!" nebo povzbuzující text při chybě
  why: string;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  correct,
  title,
  why,
}) => {
  return (
    <div className="feedback-panel-container">
      <div className={`feedback-panel ${correct ? "correct" : "wrong"}`}>
        <div className="feedback-header">
          {correct ? (
            <svg viewBox="0 0 24 24" className="feedback-icon">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="feedback-icon">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          )}
          <span className="feedback-title">{title}</span>
        </div>
        {why && <div className="feedback-why">{why}</div>}
      </div>
    </div>
  );
};

export default FeedbackPanel;
