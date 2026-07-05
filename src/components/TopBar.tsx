import React from "react";

interface TopBarProps {
  currentStep: number;
  totalSteps: number;
  xp: number;
  onClose: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentStep,
  totalSteps,
  xp,
  onClose,
}) => {
  const percent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="top-bar">
      <button onClick={onClose} className="close-btn" aria-label="Zavřít">
        <svg viewBox="0 0 24 24" className="close-icon">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>

      <div className="progress-container" title={`Krok ${currentStep} z ${totalSteps}`}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="xp-pill">{xp} XP</div>
    </div>
  );
};

export default TopBar;
