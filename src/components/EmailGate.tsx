import React, { useState } from "react";
import { t } from "../lib/i18n";
import type { Lang } from "../lib/i18n";
import CtaButton from "./CtaButton";

interface EmailGateProps {
  onUnlock: (email: string) => void;
  onClose: () => void;
  lang: Lang;
}

export const EmailGate: React.FC<EmailGateProps> = ({
  onUnlock,
  onClose,
  lang,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Jednoduchá validace emailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email.trim())) {
      setError(false);
      onUnlock(email.trim());
    } else {
      setError(true);
    }
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="modal-card">
        <button onClick={onClose} type="button" className="modal-close" aria-label="Zavřít">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="var(--text-muted)">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <h2>{t("emailGateTitle", lang)}</h2>
        <p>{t("emailGateDesc", lang)}</p>

        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(false);
          }}
          placeholder={t("emailPlaceholder", lang)}
          className="email-input"
          style={{ borderColor: error ? "var(--red)" : "var(--border)" }}
          required
        />

        {error && (
          <span style={{ color: "var(--red)", fontSize: "12px", fontWeight: 700, marginTop: "-8px", textAlign: "center" }}>
            {lang === "cs" ? "Zadejte platnou e-mailovou adresu" : "Wprowadź poprawny adres e-mail"}
          </span>
        )}

        <CtaButton
          text={t("unlockBtn", lang)}
          onClick={() => {}} // Form onSubmit to handles this
          disabled={!email.trim()}
        />
      </form>
    </div>
  );
};

export default EmailGate;
