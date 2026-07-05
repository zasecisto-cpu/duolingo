import uiCs from "../data/cs/ui.json";
import uiPl from "../data/pl/ui.json";

import skolkaCs from "../data/cs/skolka.json";
import skolkaPl from "../data/pl/skolka.json";

import plastCs from "../data/cs/plast.json";
import plastPl from "../data/pl/plast.json";

import rokCs from "../data/cs/rok.json";
import rokPl from "../data/pl/rok.json";

import extraCs from "../data/cs/quiz-extra.json";
import extraPl from "../data/pl/quiz-extra.json";

export type Lang = "cs" | "pl";

export function t(
  key: string,
  lang: Lang = "cs",
  params?: Record<string, string | number>
): any {
  const dictionary = lang === "pl" ? uiPl : uiCs;
  
  // Získat hodnotu (s fallbackem na češtinu)
  // @ts-ignore
  let value = dictionary[key] !== undefined ? dictionary[key] : uiCs[key];

  if (value === undefined) {
    return key;
  }

  if (typeof value === "string" && params) {
    let formatted = value;
    Object.entries(params).forEach(([paramName, paramValue]) => {
      formatted = formatted.replace(`{${paramName}}`, String(paramValue));
    });
    return formatted;
  }

  return value;
}

export function getGameData(levelId: string, lang: Lang = "cs"): any {
  if (levelId === "skolka") {
    return lang === "pl" ? skolkaPl : skolkaCs;
  }
  if (levelId === "plast") {
    return lang === "pl" ? plastPl : plastCs;
  }
  if (levelId === "rok") {
    return lang === "pl" ? rokPl : rokCs;
  }
  if (levelId === "quiz-extra") {
    return lang === "pl" ? extraPl : extraCs;
  }
  return null;
}
