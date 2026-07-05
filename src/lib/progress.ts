export interface LevelProgress {
  done: boolean;
  score: number;
  best: number;
  attempts: number;
}

export interface BeeProgress {
  xp: number;
  rank: string;
  levels: {
    [id: string]: LevelProgress;
  };
  badges: string[];                // pole id odemčených odznaků
  streak: number;                  // aktuální série odpovědí
  dayStreak: number;               // dny v řadě
  lastPlayed: string;              // ISO date (YYYY-MM-DD)
  questionsAnswered: number;       // celkem
  totalHoney: number;              // kg medu napříč hrami
  email?: string;                  // odemčení levelu 2
  lang: 'cs' | 'pl';
}

const STORAGE_KEY = "beementor_v1";

const DEFAULT_STATE: BeeProgress = {
  xp: 0,
  rank: "Vajíčko",
  levels: {
    skolka: { done: false, score: 0, best: 0, attempts: 0 },
    plast: { done: false, score: 0, best: 0, attempts: 0 },
    rok: { done: false, score: 0, best: 0, attempts: 0 },
  },
  badges: [],
  streak: 0,
  dayStreak: 1,
  lastPlayed: "",
  questionsAnswered: 0,
  totalHoney: 0,
  lang: "cs",
};

export function getProgress(): BeeProgress {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_STATE;
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      levels: {
        ...DEFAULT_STATE.levels,
        ...parsed.levels,
      },
      badges: parsed.badges || [],
    };
  } catch (e) {
    console.error("Chyba při načítání progressu:", e);
    return DEFAULT_STATE;
  }
}

export function saveProgressState(state: BeeProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Chyba při ukládání progressu:", e);
  }
}

// Funkce pro kontrolu denního návratu
export function checkDailyReturn(): { isReturn: boolean; streak: number; welcomeMessage: string } {
  const state = getProgress();
  const today = new Date().toISOString().split("T")[0];
  const last = state.lastPlayed;
  
  let newDayStreak = state.dayStreak || 1;
  let isReturn = false;
  let welcomeMessage = "";

  if (!last) {
    // První spuštění vůbec
    const updated = {
      ...state,
      lastPlayed: today,
      dayStreak: 1,
    };
    saveProgressState(updated);
    return { isReturn: false, streak: 1, welcomeMessage: "" };
  }

  if (last === today) {
    // Dnes už hrál
    return { isReturn: false, streak: newDayStreak, welcomeMessage: "" };
  }

  const lastDate = new Date(last);
  const todayDate = new Date(today);
  const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Hrál včera
    newDayStreak += 1;
    isReturn = true;
    welcomeMessage = state.lang === "cs" 
      ? `Vítej zpět! Den ${newDayStreak} v řadě.` 
      : `Witaj z powrotem! Dzień ${newDayStreak} z rzędu.`;
  } else {
    // Přerušení
    newDayStreak = 1;
    isReturn = true;
    welcomeMessage = state.lang === "cs" ? "Rád tě zase vidím." : "Miło cię znowu widzieć.";
  }

  const updated: BeeProgress = {
    ...state,
    lastPlayed: today,
    dayStreak: newDayStreak,
  };

  // Kontrola odznaku Neúnavná včela (3 dny v řadě)
  if (newDayStreak >= 3 && !updated.badges.includes("neunav-vcela")) {
    updated.badges.push("neunav-vcela");
  }

  saveProgressState(updated);
  return { isReturn, streak: newDayStreak, welcomeMessage };
}
