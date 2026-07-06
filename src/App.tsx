import { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  getProgress,
  saveProgressState,
  checkDailyReturn,
} from "./lib/progress";
import type { BeeProgress } from "./lib/progress";
import { getRankDetails, checkBadgesToUnlock } from "./lib/gamification";
import { getGameData, t } from "./lib/i18n";
import type { Lang } from "./lib/i18n";

import Layout from "./components/Layout";
import RankBar from "./components/RankBar";
import LevelMap from "./components/LevelMap";
import EmailGate from "./components/EmailGate";
import ShareCard from "./components/ShareCard";
import BadgeGrid from "./components/BadgeGrid";
import ResultScreen from "./components/ResultScreen";
import Toast from "./components/Toast";

import QuizGame from "./games/QuizGame";
import CombGame from "./games/CombGame";
import SeasonGame from "./games/SeasonGame";

// Supabase stub import
import { saveEmail, saveScore } from "./lib/supabase-stub";

function AppContent() {
  const [progress, setProgress] = useState<BeeProgress>(getProgress());
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [welcomeToast, setWelcomeToast] = useState<string | null>(null);

  // States pro předávání informací na ResultScreen
  const [lastGameId, setLastGameId] = useState<string>("skolka");
  const [lastScore, setLastScore] = useState(0);
  const [lastMaxScore, setLastMaxScore] = useState(15);
  const [lastXpEarned, setLastXpEarned] = useState(0);
  const [lastStreakEarned, setLastStreakEarned] = useState(0);
  const [lastHoneyEarned, setLastHoneyEarned] = useState<number | undefined>(undefined);
  const [newlyUnlockedBadgeId, setNewlyUnlockedBadgeId] = useState<string | null>(null);

  const navigate = useNavigate();
  const lang: Lang = progress.lang || "cs";

  // Kontrola denního přihlášení a uvítací zprávy
  useEffect(() => {
    const checkResult = checkDailyReturn();
    if (checkResult.isReturn && checkResult.welcomeMessage) {
      setWelcomeToast(checkResult.welcomeMessage);
    }
    // Synchronizovat progress
    setProgress(getProgress());
  }, []);

  const handleToggleLang = (newLang: Lang) => {
    const updated = {
      ...progress,
      lang: newLang,
    };
    saveProgressState(updated);
    setProgress(updated);
  };

  // Reakce na jednotlivé odpovědi v hrách (XP, streak, odznaky)
  const handleAnswerChecked = (correct: boolean) => {
    const updated = { ...progress };

    // Přičíst XP (+10 za správně, +2 za chybu)
    const xpAdded = correct ? 10 : 2;
    updated.xp += xpAdded;

    // Upravit sérii (streak)
    if (correct) {
      updated.streak += 1;
    } else {
      updated.streak = 0;
    }

    // Celkový počet odpovědí
    updated.questionsAnswered += 1;

    // Přepočítat aktuální hodnost
    const details = getRankDetails(updated.xp);
    updated.rank = details.currentRank;

    // Kontrola odznaků (např. "Bez zaváhání" na 10 v řadě, "Vytrvalost" na 100 otázek)
    const newBadges = checkBadgesToUnlock(updated);
    if (newBadges.length > 0) {
      setNewlyUnlockedBadgeId(newBadges[0]);
    }

    saveProgressState(updated);
    setProgress(updated);
  };

  // Dokončení celého levelu
  const handleLevelCompleted = (
    levelId: string,
    score: number,
    maxScore: number,
    honeyYield?: number
  ) => {
    const updated = { ...progress };
    let xpBonus = 0;

    // Zapsat dokončený pokus
    const currentLvl = updated.levels[levelId] || { done: false, score: 0, best: 0, attempts: 0 };
    const newAttempts = currentLvl.attempts + 1;
    const isPerfect = score === maxScore;

    if (isPerfect) {
      xpBonus = 50; // Bonus za bezchybné dokončení
      updated.xp += xpBonus;
    }

    // Aktualizovat rekordy
    updated.levels[levelId] = {
      done: true,
      score,
      best: Math.max(currentLvl.best, score),
      attempts: newAttempts,
    };

    // Zapsat med (SeasonGame)
    if (honeyYield !== undefined) {
      updated.totalHoney += honeyYield;
      setLastHoneyEarned(honeyYield);
    } else {
      setLastHoneyEarned(undefined);
    }

    // Nastavit hodnoty pro výsledkovou kartu
    setLastGameId(levelId);
    setLastScore(score);
    setLastMaxScore(maxScore);
    
    // Celkové získané XP za hru: správné a nesprávné odpovědi byly přičítány za běhu.
    // Tady spočítáme celkový přírůstek, což odpovídá: bonus + případné správné/nesprávné z odpovědí.
    // Ale pro zobrazení na ResultScreen ukážeme spíš finální bonus a stav série.
    setLastXpEarned(xpBonus);
    setLastStreakEarned(updated.streak);

    // Přepočítat hodnost
    const details = getRankDetails(updated.xp);
    updated.rank = details.currentRank;

    // Zkontrolovat odznaky na konci hry
    const newBadges = checkBadgesToUnlock(updated);
    if (newBadges.length > 0) {
      setNewlyUnlockedBadgeId(newBadges[0]);
    } else {
      setNewlyUnlockedBadgeId(null);
    }

    saveProgressState(updated);
    setProgress(updated);

    // Supabase stub
    saveScore({
      levelId,
      score,
      maxScore,
      xpTotal: updated.xp,
      badgesCount: updated.badges.length,
    });

    navigate("/vysledek");
  };

  // Odemčení levelu 2 za email
  const handleEmailUnlock = (email: string) => {
    const updated = {
      ...progress,
      email,
    };
    saveProgressState(updated);
    setProgress(updated);
    setShowEmailGate(false);

    // Zavolat supabase stub
    saveEmail(email);

    // Otevřít Level 2
    navigate("/hra/plast");
  };

  // Otevření dalšího levelu (ResultScreen)
  const handleNextLevel = () => {
    if (lastGameId === "skolka") {
      if (!progress.email) {
        setShowEmailGate(true);
      } else {
        navigate("/hra/plast");
      }
    } else if (lastGameId === "plast") {
      navigate("/hra/rok");
    }
  };

  return (
    <Layout>
      {/* Toast uvítání denního návratu */}
      {welcomeToast && (
        <Toast message={welcomeToast} onClose={() => setWelcomeToast(null)} />
      )}

      {/* Společný RankBar nahoře na mapě */}
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
              {/* Hlavní záhlaví s volbou jazyka */}
              <header
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px 4px 20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px", fontWeight: 800 }}>🐝 BeeMentor</span>
                </div>
                <div className="app-header-lang">
                  <button
                    onClick={() => handleToggleLang("cs")}
                    className={`app-header-lang-btn ${lang === "cs" ? "active" : ""}`}
                  >
                    CS
                  </button>
                  <button
                    onClick={() => handleToggleLang("pl")}
                    className={`app-header-lang-btn ${lang === "pl" ? "active" : ""}`}
                  >
                    PL
                  </button>
                </div>
              </header>

              <RankBar xp={progress.xp} lang={lang} />

              <div className="scrollable-page-content">
                <LevelMap
                  progress={progress}
                  onSelectLevel={(lvlId, topicId) => {
                    if (topicId) {
                      navigate(`/hra/${lvlId}?topic=${topicId}`);
                    } else {
                      navigate(`/hra/${lvlId}`);
                    }
                  }}
                  onOpenBadges={() => navigate("/odznaky")}
                  onTriggerEmailGate={() => setShowEmailGate(true)}
                  lang={lang}
                />
              </div>
            </div>
          }
        />

        <Route
          path="/hra/:id"
          element={
            <GameRouter
              progress={progress}
              lang={lang}
              onAnswer={handleAnswerChecked}
              onComplete={handleLevelCompleted}
              onBack={() => navigate("/")}
              onTriggerEmailGate={() => setShowEmailGate(true)}
            />
          }
        />

        <Route
          path="/vysledek"
          element={
            <div className="scrollable-page-content">
              <ResultScreen
                levelId={lastGameId}
                score={lastScore}
                maxScore={lastMaxScore}
                xpEarned={lastXpEarned}
                streakEarned={lastStreakEarned}
                honeyEarned={lastHoneyEarned}
                newlyUnlockedBadgeId={newlyUnlockedBadgeId}
                lang={lang}
                onPlayAgain={() => navigate(`/hra/${lastGameId}`)}
                onBackToMap={() => navigate("/")}
                onShare={() => setShowShareCard(true)}
                onNextLevel={
                  (lastGameId === "skolka" && progress.levels.skolka?.done) ||
                  (lastGameId === "plast" && progress.levels.plast?.done)
                    ? handleNextLevel
                    : undefined
                }
              />
            </div>
          }
        />

        <Route
          path="/odznaky"
          element={
            <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
              <div className="badge-collection-header">
                <button onClick={() => navigate("/")} className="close-btn" aria-label="Zpět">
                  <svg viewBox="0 0 24 24" className="close-icon">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                  </svg>
                </button>
                <h2>{t("badgesCollection", lang)}</h2>
              </div>
              <div className="scrollable-page-content" style={{ padding: "0 20px 20px 20px" }}>
                <BadgeGrid unlockedBadgeIds={progress.badges} />
              </div>
            </div>
          }
        />
      </Routes>

      {/* Modální okna (Email Gate a Share Card) */}
      {showEmailGate && (
        <EmailGate
          onUnlock={handleEmailUnlock}
          onClose={() => setShowEmailGate(false)}
          lang={lang}
        />
      )}

      {showShareCard && (
        <ShareCard
          levelName={
            lastGameId === "skolka"
              ? "Včelí školka"
              : lastGameId === "plast"
              ? "Čtení plástu"
              : "Včelařův rok"
          }
          scoreText={`${lastScore} / ${lastMaxScore} ${lang === "cs" ? "správně" : "poprawnie"}`}
          honeyText={lastHoneyEarned !== undefined ? `${lastHoneyEarned} kg medu` : undefined}
          rankName={progress.rank}
          badgesCount={progress.badges.length}
          lang={lang}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </Layout>
  );
}

// Pod-router pro dynamické spouštění her na základě ID v URL
function GameRouter({
  progress,
  lang,
  onAnswer,
  onComplete,
  onBack,
  onTriggerEmailGate,
}: {
  progress: BeeProgress;
  lang: Lang;
  onAnswer: (correct: boolean) => void;
  onComplete: (levelId: string, score: number, maxScore: number, honey?: number) => void;
  onBack: () => void;
  onTriggerEmailGate: () => void;
}) {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get("topic");

  const gameData = getGameData(id || "skolka", lang);

  // Kontrola zamčených levelů
  useEffect(() => {
    if (id === "plast") {
      const isL1Done = progress.levels.skolka?.done || false;
      if (!isL1Done) {
        onBack();
      } else if (!progress.email) {
        onBack();
        onTriggerEmailGate();
      }
    } else if (id === "rok") {
      const isL2Done = progress.levels.plast?.done || false;
      if (!isL2Done) {
        onBack();
      }
    }
  }, [id, progress, onBack, onTriggerEmailGate]);

  if (!gameData) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Game data not found.</div>;
  }

  if (id === "skolka") {
    // Rozhodnout, zda spouštíme klasickou školku, nebo konkrétní okruh
    let finalQuestions = [];
    let type: "text-choice" | "image-choice" = "text-choice";

    if (topicId) {
      // Získat otázky pro konkrétní okruh z quiz-extra
      const extraData = getGameData("quiz-extra", lang);
      const matchedTopic = (extraData.topics || []).find((t: any) => t.id === topicId);
      if (matchedTopic) {
        finalQuestions = matchedTopic.questions;
        type = "text-choice";
      }
    } else {
      // Klasická školka ( levels z skolka.json)
      // Školka má 3 podúrovně (první je image-choice, další dvě jsou text-choice).
      // Sloučíme je, ale musíme zohlednit typ. Pro klasickou školku zvolíme první sublevel (image-choice) nebo je sloučíme a přizpůsobíme.
      // Pro čistou jednoduchost klasického levelu 1 sloučíme všechny, a jelikož QuizGame dostává typ pro celou sadu, rozlišíme to na základě první otázky nebo je spustíme jako text-choice.
      // Abychom zachovali image-choice: sloučíme pouze ty, které odpovídají první podúrovni ("Poznej včelu") která je typem image-choice, a další spustíme jako text-choice,
      // nebo můžeme QuizGame nechat zobrazit typ dynamicky z otázky. 
      // Vytvoříme klasické chování: pokud jde o původní level 1, načteme všech 15 otázek. Prvních 5 (Poznej včelu) má typ image-choice.
      // Upravme typ zobrazení v QuizGame dynamically. Naše QuizGame.tsx ale očekává typ v props `levelType`.
      // Abychom zachovali Duolingo prototyp, Klasická Školka Level 1 spustí sloučených 15 otázek jako typ "text-choice" (protože 10 z 15 je textových) a včelí kresby ukážeme v okruzích.
      // Nebo: Okruh A (biologie) má typ "text-choice" a Klasická Školka má typ "text-choice", ale pokud chceme image-choice, můžeme k němu přistoupit.
      // Pojďme načíst otázky z levels a nastavit typ na "text-choice" pro sloučené:
      finalQuestions = gameData.levels.flatMap((lvl: any) => lvl.questions);
      type = "text-choice";
    }
    return (
      <QuizGame
        levelType={type}
        rawQuestions={finalQuestions}
        lang={lang}
        xp={progress.xp}
        streak={progress.streak}
        onAnswer={onAnswer}
        onComplete={(score) => onComplete("skolka", score, finalQuestions.length)}
        onBack={onBack}
      />
    );
  }

  if (id === "plast") {
    return (
      <CombGame
        data={gameData}
        lang={lang}
        xp={progress.xp}
        streak={progress.streak}
        onAnswer={onAnswer}
        onComplete={(score) => onComplete("plast", score, 6)}
        onBack={onBack}
      />
    );
  }

  if (id === "rok") {
    return (
      <SeasonGame
        data={gameData}
        lang={lang}
        xp={progress.xp}
        streak={progress.streak}
        onAnswer={onAnswer}
        onComplete={(score, stats) => {
          if (stats) {
            onComplete("rok", score, 7, stats.med);
          } else {
            onComplete("rok", score, 7);
          }
        }}
        onBack={onBack}
      />
    );
  }

  return null;
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
