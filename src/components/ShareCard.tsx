import React, { useEffect, useRef, useState } from "react";
import { drawShareCanvas, shareCanvasImage } from "../lib/share";
import type { Lang } from "../lib/i18n";

interface ShareCardProps {
  levelName: string;
  scoreText: string;
  honeyText?: string;
  rankName: string;
  badgesCount: number;
  lang: Lang;
  onClose: () => void;
}

export const ShareCard: React.FC<ShareCardProps> = ({
  levelName,
  scoreText,
  honeyText,
  rankName,
  badgesCount,
  lang,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawShareCanvas(
      canvas,
      {
        levelName,
        scoreText,
        honeyText,
        rankName,
        badgesCount,
      },
      lang
    );

    // Převést canvas na DataURL pro náhledový <img> tag
    setImageSrc(canvas.toDataURL("image/png"));
  }, [levelName, scoreText, honeyText, rankName, badgesCount, lang]);

  const handleShareClick = async () => {
    const canvas = canvasRef.current;
    if (!canvas || sharing) return;

    setSharing(true);
    const title = lang === "cs" ? "BeeMentor Certifikát" : "Certyfikat BeeMentor";
    const text = lang === "cs" 
      ? `Sleduj můj včelařský pokrok v BeeMentor Hry! Jsem na hodnosti: ${rankName}.`
      : `Śledź mój postęp pszczelarski w grach BeeMentor! Moja ranga to: ${rankName}.`;

    await shareCanvasImage(canvas, title, text);
    setSharing(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card share-modal-card">
        <button onClick={onClose} className="modal-close" aria-label="Zavřít">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="var(--text-muted)">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <h2>{lang === "cs" ? "Získej certifikát" : "Zdobądź certyfikat"}</h2>

        <div className="share-canvas-container">
          {imageSrc ? (
            <img src={imageSrc} alt="Preview" className="share-canvas-element" />
          ) : (
            <div style={{ color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              Loading...
            </div>
          )}
        </div>

        {/* Skrytý canvas sloužící pro export */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        <button
          onClick={handleShareClick}
          disabled={sharing}
          className="cta-button primary"
          style={{ width: "100%" }}
        >
          {sharing
            ? (lang === "cs" ? "Sdílení..." : "Udostępnianie...")
            : (lang === "cs" ? "Sdílet certifikát" : "Udostępnij certyfikat")}
        </button>
      </div>
    </div>
  );
};

export default ShareCard;
