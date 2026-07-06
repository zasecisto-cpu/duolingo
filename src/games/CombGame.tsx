import React, { useState } from "react";
import TopBar from "../components/TopBar";
import StreakBar from "../components/StreakBar";
import FeedbackPanel from "../components/FeedbackPanel";
import Toast from "../components/Toast";
import CtaButton from "../components/CtaButton";
import { t } from "../lib/i18n";
import type { Lang } from "../lib/i18n";
import { shuffleArray } from "../lib/shuffle";

interface Task {
  find: string;
  label: string;
  why: string;
}

interface CombGameProps {
  data: {
    id: string;
    title: string;
    tasks: Task[];
  };
  lang: Lang;
  xp: number;
  streak: number;
  onAnswer: (correct: boolean) => void;
  onComplete: (score: number) => void;
  onBack: () => void;
}

// Pevné rozložení typů buněk v plástu 8x5
const getCellType = (col: number, row: number): string => {
  // Matečník visí dole uprostřed (col 3, row 4)
  if (col === 3 && row === 4) return "matecnik";
  
  // Vajíčka v centru plodového tělesa
  if ((col === 3 || col === 4) && (row === 2 || row === 3)) return "vajicko";
  
  // Larvy kolem vajíček
  if (
    (col === 2 && (row === 2 || row === 3)) ||
    (col === 5 && (row === 2 || row === 3)) ||
    ((col === 3 || col === 4) && row === 1)
  ) return "larva";

  // Zavíčkovaný plod tvoří další kruh
  if (
    (col === 1 && (row === 2 || row === 3)) ||
    (col === 6 && (row === 2 || row === 3)) ||
    (col === 2 && row === 1) ||
    (col === 5 && row === 1) ||
    ((col === 3 || col === 4) && row === 0)
  ) return "plod";

  // Pyl tvoří věnec nad plodem
  if (
    (col === 0 && row === 1) ||
    (col === 1 && row === 1) ||
    (col === 2 && row === 0) ||
    (col === 5 && row === 0) ||
    (col === 6 && row === 1) ||
    (col === 7 && row === 1)
  ) return "pyl";

  // Med je v rozích nahoře a na okrajích
  return "med";
};

// Generovat body pro flat-topped hexagon
const getHexPointsFlat = (cx: number, cy: number, r: number): string => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return points.join(" ");
};

// Generovat náhodný barevný odstín pro pyl
const getPollenColor = (col: number, row: number): string => {
  const sum = col + row;
  if (sum % 3 === 0) return "#FFA225"; // Oranžový
  if (sum % 3 === 1) return "#FFE042"; // Žlutý
  return "#D5C09B"; // Světle hnědý
};

export const CombGame: React.FC<CombGameProps> = ({
  data,
  lang,
  xp,
  streak,
  onAnswer,
  onComplete,
  onBack,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [clickedCell, setClickedCell] = useState<{ col: number; row: number } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [praiseText, setPraiseText] = useState<string | null>(null);
  const [correctPool, setCorrectPool] = useState<string[]>([]);
  const [wrongPool, setWrongPool] = useState<string[]>([]);

  const tasks = data.tasks;
  const currentTask = tasks[currentIdx];
  const totalTasks = tasks.length;

  const hexSize = 25; // Poloměr hexu
  const hSpacing = hexSize * 1.5;
  const vSpacing = hexSize * Math.sqrt(3);

  const handleCellClick = (col: number, row: number) => {
    if (isAnswered) return;

    // Zamezit kliknutí na matečník, pokud ho hráč nehledá (matečník visí jen na určené buňce)
    const cellType = getCellType(col, row);
    
    setClickedCell({ col, row });
    setIsAnswered(true);

    const isCorrect = cellType === currentTask.find;
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    onAnswer(isCorrect);

    // Mikropochvaly (pool bez opakování)
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
    setClickedCell(null);
    setPraiseText(null);

    if (currentIdx + 1 < totalTasks) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      onComplete(score);
    }
  };

  const isCurrentSelectionCorrect = (): boolean => {
    if (!clickedCell) return false;
    const type = getCellType(clickedCell.col, clickedCell.row);
    return type === currentTask.find;
  };

  const getFeedbackTitle = (): string => {
    if (isCurrentSelectionCorrect()) {
      return t("correctTitle", lang);
    }
    return praiseText || t("wrongTitle", lang);
  };

  // Vykreslení vnitřní grafiky hexagonu
  const renderHexContent = (cx: number, cy: number, col: number, row: number) => {
    const type = getCellType(col, row);

    if (type === "med") {
      // Zavíčkovaný med (zlatá vosková plocha)
      return (
        <g>
          <polygon
            points={getHexPointsFlat(cx, cy, hexSize - 3)}
            fill="#FFE7A2"
            stroke="#E3BE63"
            strokeWidth="1"
          />
          <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} stroke="#F2CE73" strokeWidth="1" />
        </g>
      );
    }

    if (type === "pyl") {
      // Pyl (barevný zásyp)
      const pColor = getPollenColor(col, row);
      return (
        <g>
          <polygon
            points={getHexPointsFlat(cx, cy, hexSize - 4)}
            fill={pColor}
          />
          <circle cx={cx - 3} cy={cy - 3} r="1" fill="rgba(0,0,0,0.15)" />
          <circle cx={cx + 3} cy={cy + 2} r="1" fill="rgba(0,0,0,0.15)" />
        </g>
      );
    }

    if (type === "plod") {
      // Zavíčkovaný plod (hnědé víčko)
      return (
        <polygon
          points={getHexPointsFlat(cx, cy, hexSize - 3)}
          fill="#D2B48C"
          stroke="#A0522D"
          strokeWidth="1"
        />
      );
    }

    if (type === "larva") {
      // Bílá larva stočená v buňce
      return (
        <g>
          {/* Prázdné dno buňky */}
          <polygon points={getHexPointsFlat(cx, cy, hexSize - 2)} fill="#E8E8E8" />
          {/* Larva jako bílý C-tvar */}
          <path
            d={`M ${cx - 5} ${cy - 5} A 7 7 0 1 0 ${cx - 5} ${cy + 5}`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - 5} ${cy - 5} A 7 7 0 1 0 ${cx - 5} ${cy + 5}`}
            fill="none"
            stroke="#DCDCDC"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      );
    }

    if (type === "vajicko") {
      // Drobné bílé vajíčko na dně
      return (
        <g>
          <polygon points={getHexPointsFlat(cx, cy, hexSize - 2)} fill="#E8E8E8" />
          {/* Vajíčko jako tenká bílá čárka */}
          <line
            x1={cx - 1}
            y1={cy - 3}
            x2={cx + 2}
            y2={cy + 3}
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      );
    }

    if (type === "matecnik") {
      // Matečník (žaludovitý tvar visící dolů)
      return (
        <g>
          <polygon points={getHexPointsFlat(cx, cy, hexSize - 2)} fill="#DCDCDC" />
          {/* Kresba visícího matečníku */}
          <path
            d={`M ${cx - 8} ${cy} C ${cx - 8} ${cy + 22}, ${cx + 8} ${cy + 22}, ${cx + 8} ${cy} Z`}
            fill="#CD853F"
            stroke="#8B4513"
            strokeWidth="2"
          />
          <path
            d={`M ${cx - 5} ${cy + 4} Q ${cx} ${cy + 18} ${cx + 5} ${cy + 4}`}
            fill="none"
            stroke="#8B4513"
            strokeWidth="1"
          />
        </g>
      );
    }

    // Prázdná buňka (dno)
    return (
      <polygon
        points={getHexPointsFlat(cx, cy, hexSize - 2)}
        fill="#FFFFFF"
      />
    );
  };

  return (
    <div className="main-content" style={{ padding: 0 }}>
      {isAnswered && isCurrentSelectionCorrect() && praiseText && (
        <Toast message={praiseText} onClose={() => setPraiseText(null)} />
      )}

      <TopBar
        currentStep={currentIdx + 1}
        totalSteps={totalTasks}
        xp={xp}
        onClose={onBack}
      />

      <StreakBar streak={streak} lang={lang} />

      <div className="game-content-area">
        <div className="game-scroll-area">
          {/* Instrukční karta */}
          <div className="season-description" style={{ padding: "12px", margin: "10px 0 16px 0", textAlign: "center" }}>
            <div className="question-card-label" style={{ marginBottom: "2px" }}>
              {lang === "cs" ? "Klikni na buňku a najdi:" : "Kliknij na komórkę i znajdź:"}
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "var(--orange)", textTransform: "uppercase" }}>
              {currentTask.label}
            </h2>
          </div>

          {/* SVG plást (8 sloupců × 5 řádků) */}
          <div className="comb-svg-container">
            <svg className="comb-svg" viewBox="0 0 420 300">
              <g>
                {Array.from({ length: 8 }).map((_, col) =>
                  Array.from({ length: 5 }).map((__, row) => {
                    // Výpočet středu hexagonu
                    const cx = col * hSpacing + 35;
                    const cy = row * vSpacing + (col % 2 === 0 ? 0 : vSpacing / 2) + 30;

                    const isClicked = clickedCell && clickedCell.col === col && clickedCell.row === row;
                    const type = getCellType(col, row);

                    let cellClass = "hex-grid-cell";
                    if (isAnswered) {
                      if (type === currentTask.find) {
                        cellClass += " correct-hex";
                      } else if (isClicked) {
                        cellClass += " wrong-hex";
                      }
                    } else if (isClicked) {
                      cellClass += " selected-hex";
                    }

                    return (
                      <g key={`${col}-${row}`} onClick={() => handleCellClick(col, row)}>
                        {/* Vnější okraj / pozadí hexu */}
                        <polygon
                          points={getHexPointsFlat(cx, cy, hexSize)}
                          fill="#F5F5F5"
                          className={cellClass}
                        />
                        {/* Vnitřek buňky */}
                        {renderHexContent(cx, cy, col, row)}
                      </g>
                    );
                  })
                )}
              </g>
            </svg>
          </div>
        </div>

        {/* Spodní vyhodnocení v pevné patičce */}
        <div className="game-footer-area">
          {isAnswered ? (
            <>
              <FeedbackPanel
                correct={isCurrentSelectionCorrect()}
                title={getFeedbackTitle()}
                why={currentTask.why}
              />
              <div style={{ marginTop: "12px" }}>
                <CtaButton
                  text={currentIdx + 1 === totalTasks ? t("finish", lang) : t("continue", lang)}
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

export default CombGame;
