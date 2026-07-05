import React from "react";
import BeeIllustration from "./BeeIllustration";

interface OptionCardProps {
  text: string;
  selected: boolean;
  disabled: boolean;
  state: "default" | "correct" | "wrong" | "dimmed";
  type: "text-choice" | "image-choice";
  index: number;
  onClick: () => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  text,
  selected,
  disabled,
  state,
  type,
  index,
  onClick,
}) => {
  const isImageChoice = type === "image-choice";
  const optionLetter = String.fromCharCode(65 + index); // A, B, C...

  // Sestavení tříd pro stylování stavů
  let cardClass = "";
  if (state === "correct") {
    cardClass = "correct";
  } else if (state === "wrong") {
    cardClass = "wrong";
  } else if (state === "dimmed") {
    cardClass = "dimmed";
  } else if (selected) {
    cardClass = "selected";
  }

  if (isImageChoice) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`image-option-card ${cardClass}`}
        type="button"
      >
        <BeeIllustration type={text} />
        <span className="image-option-label">{text}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`option-card ${cardClass}`}
      type="button"
    >
      <div className="option-icon-wrapper">
        <span style={{ fontSize: "16px", fontWeight: 800 }}>{optionLetter}</span>
      </div>
      <span className="option-text">{text}</span>
    </button>
  );
};

export default OptionCard;
