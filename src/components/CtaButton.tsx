import React from "react";

interface CtaButtonProps {
  text: string;
  onClick: () => void;
  correctState?: boolean | null; // true = správně, false = chyba, null/undefined = základní/před odpovědí
  disabled?: boolean;
}

export const CtaButton: React.FC<CtaButtonProps> = ({
  text,
  onClick,
  correctState,
  disabled = false,
}) => {
  let btnClass = "primary";

  if (correctState === false) {
    btnClass = "secondary";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`cta-button ${btnClass}`}
      type="button"
    >
      {text}
    </button>
  );
};

export default CtaButton;
