import type { BeeProgress } from "./progress";

export interface RankInfo {
  name: string;
  xp: number;
}

export const RANKS: RankInfo[] = [
  { name: "Vajíčko",          xp: 0    },
  { name: "Larva",            xp: 100  },
  { name: "Kukla",            xp: 250  },
  { name: "Létavka",          xp: 500  },
  { name: "Strážkyně úlu",   xp: 900  },
  { name: "Zkušená včelařka", xp: 1400 },
  { name: "Mistr včelař",     xp: 2000 },
];

export interface Badge {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

export const BADGES: Badge[] = [
  { id: "prvni-kontrola",  icon: "check",    name: "První kontrola",  desc: "Dokonči první level" },
  { id: "bystre-oko",      icon: "eye",      name: "Bystré oko",      desc: "Čtení plástu bez chyby" },
  { id: "znalec-ulu",      icon: "star",     name: "Znalec úlu",      desc: "100 % ve Včelí školce" },
  { id: "rozeny-vcelas",   icon: "trophy",   name: "Rozený včelař",   desc: "Nejlepší titul v sezóně" },
  { id: "neunav-vcela",    icon: "calendar", name: "Neúnavná včela",  desc: "Hrej 3 dny po sobě" },
  { id: "sberatel-medu",   icon: "droplet",  name: "Sběratel medu",   desc: "50 kg medu celkem" },
  { id: "bez-zavahani",    icon: "flame",    name: "Bez zaváhání",    desc: "Série 10 správných" },
  { id: "vytrvalost",      icon: "activity", name: "Vytrvalost",      desc: "100 zodpovězených otázek" },
  { id: "mistr-sezony",    icon: "crown",    name: "Mistr sezóny",    desc: "Odemkni všechny odznaky" },
];

// Získat info o aktuální hodnosti
export function getRankDetails(xp: number): {
  currentRank: string;
  nextRank: string | null;
  minXp: number;
  maxXp: number;
  progressPercent: number;
} {
  let currentRankIndex = 0;
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].xp) {
      currentRankIndex = i;
      break;
    }
  }

  const current = RANKS[currentRankIndex];
  const next = currentRankIndex + 1 < RANKS.length ? RANKS[currentRankIndex + 1] : null;

  const minXp = current.xp;
  const maxXp = next ? next.xp : current.xp;
  
  let progressPercent = 100;
  if (next) {
    progressPercent = Math.max(0, Math.min(100, ((xp - minXp) / (maxXp - minXp)) * 100));
  }

  return {
    currentRank: current.name,
    nextRank: next ? next.name : null,
    minXp,
    maxXp,
    progressPercent,
  };
}

// Zkontrolovat a odemknout nové odznaky
export function checkBadgesToUnlock(progress: BeeProgress): string[] {
  const newlyUnlocked: string[] = [];
  const currentBadges = new Set(progress.badges);

  // Pomocný helper pro zamezení duplicit
  const tryUnlock = (badgeId: string) => {
    if (!currentBadges.has(badgeId)) {
      newlyUnlocked.push(badgeId);
      progress.badges.push(badgeId);
      currentBadges.add(badgeId);
    }
  };

  // 1. První kontrola: Dokonči jakýkoliv level
  const anyDone = Object.values(progress.levels).some((lvl) => lvl.done);
  if (anyDone) {
    tryUnlock("prvni-kontrola");
  }

  // 2. Bystré oko: Čtení plástu bez chyby (score 6/6)
  if (progress.levels.plast.done && progress.levels.plast.best === 6) {
    tryUnlock("bystre-oko");
  }

  // 3. Znalec úlu: 100% ve Včelí školce (score 15/15)
  if (progress.levels.skolka.done && progress.levels.skolka.best === 15) {
    tryUnlock("znalec-ulu");
  }

  // 4. Rozený včelař: dokonči Včelařův rok s hodnocením >= 6
  if (progress.levels.rok.done && progress.levels.rok.best >= 6) {
    tryUnlock("rozeny-vcelas");
  }

  // 5. Neúnavná včela: dayStreak >= 3
  if (progress.dayStreak >= 3) {
    tryUnlock("neunav-vcela");
  }

  // 6. Sběratel medu: 50+ kg medu
  if (progress.totalHoney >= 50) {
    tryUnlock("sberatel-medu");
  }

  // 7. Bez zaváhání: streak >= 10
  if (progress.streak >= 10) {
    tryUnlock("bez-zavahani");
  }

  // 8. Vytrvalost: 100+ zodpovězených otázek
  if (progress.questionsAnswered >= 100) {
    tryUnlock("vytrvalost");
  }

  // 9. Mistr sezóny: Odemkni všechny ostatní 8 odznaků
  const otherBadges = [
    "prvni-kontrola",
    "bystre-oko",
    "znalec-ulu",
    "rozeny-vcelas",
    "neunav-vcela",
    "sberatel-medu",
    "bez-zavahani",
    "vytrvalost",
  ];
  const unlockedAllOthers = otherBadges.every((id) => currentBadges.has(id));
  if (unlockedAllOthers) {
    tryUnlock("mistr-sezony");
  }

  return newlyUnlocked;
}
