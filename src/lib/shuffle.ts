// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// Získat zamíchané a zdeduplikované otázky na základě otázkového textu (slouží jako ID)
export function getDeduplicatedQuestions<T extends { q: string }>(
  allQuestions: T[],
  lastShownTexts: string[],
  targetCount: number
): { questions: T[]; updatedLastShownTexts: string[] } {
  const recentSet = new Set(lastShownTexts);
  
  // Rozdělit na nepoužité a nedávno použité
  const fresh = allQuestions.filter((q) => !recentSet.has(q.q));
  const recent = allQuestions.filter((q) => recentSet.has(q.q));

  // Zamíchat obě skupiny
  const shuffledFresh = shuffleArray(fresh);
  const shuffledRecent = shuffleArray(recent);

  // Sloučit s tím, že čerstvé mají prioritu
  const combined = [...shuffledFresh, ...shuffledRecent];
  const selected = combined.slice(0, targetCount);

  // Aktualizovat historii zobrazených (max 20)
  const newlyShownTexts = selected.map((q) => q.q);
  const updatedHistory = [...lastShownTexts, ...newlyShownTexts].slice(-20);

  return {
    questions: selected,
    updatedLastShownTexts: updatedHistory,
  };
}
