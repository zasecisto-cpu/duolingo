import React from "react";

interface BeeIllustrationProps {
  type: string; // "matka" | "dělnice" | "trubec" (and translations/PL stubs)
}

export const BeeIllustration: React.FC<BeeIllustrationProps> = ({ type }) => {
  const normalized = type.toLowerCase().trim();

  // Vyhodnotit typ (včetně polských ekvivalentů)
  const isQueen = normalized.includes("matka") || normalized.includes("królowa");
  const isDrone = normalized.includes("trubec") || normalized.includes("truteń");

  if (isQueen) {
    // Královna/Matka - Dlouhé tělo, zadeček
    return (
      <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
        {/* Nožičky */}
        <path d="M40 50 C25 52 25 46 25 46" className="bee-legs" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />
        <path d="M80 50 C95 52 95 46 95 46" className="bee-legs" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />
        <path d="M38 70 C20 72 20 66 20 66" className="bee-legs" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />
        <path d="M82 70 C100 72 100 66 100 66" className="bee-legs" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />
        <path d="M40 90 C22 92 22 86 22 86" className="bee-legs" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />
        <path d="M80 90 C98 92 98 86 98 86" className="bee-legs" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />

        {/* Dlouhý protáhlý zadeček */}
        <ellipse cx="60" cy="85" rx="14" ry="26" fill="#EF9F27" />
        {/* Černé proužky na zadečku */}
        <path d="M48 68 Q60 74 72 68" stroke="#1C1C1C" strokeWidth="4" fill="none" />
        <path d="M47 77 Q60 83 73 77" stroke="#1C1C1C" strokeWidth="4" fill="none" />
        <path d="M47 86 Q60 92 73 86" stroke="#1C1C1C" strokeWidth="4" fill="none" />
        <path d="M49 95 Q60 100 71 95" stroke="#1C1C1C" strokeWidth="4" fill="none" />
        <path d="M52 103 Q60 107 68 103" stroke="#1C1C1C" strokeWidth="4" fill="none" />

        {/* Hruď */}
        <ellipse cx="60" cy="50" rx="16" ry="12" fill="#EF9F27" />
        <circle cx="60" cy="50" r="8" fill="#1C1C1C" />

        {/* Křídla (kratší než zadeček) */}
        <ellipse cx="46" cy="40" rx="9" ry="20" transform="rotate(-25 46 40)" fill="#D7EFF7" stroke="#A1D4E6" strokeWidth="1.5" opacity="0.8" />
        <ellipse cx="74" cy="40" rx="9" ry="20" transform="rotate(25 74 40)" fill="#D7EFF7" stroke="#A1D4E6" strokeWidth="1.5" opacity="0.8" />

        {/* Hlava */}
        <circle cx="60" cy="33" r="8.5" fill="#1C1C1C" />
        {/* Tykadla */}
        <path d="M56 26 Q52 18 46 20" stroke="#1C1C1C" strokeWidth="2.5" fill="none" />
        <path d="M64 26 Q68 18 74 20" stroke="#1C1C1C" strokeWidth="2.5" fill="none" />
        {/* Oči */}
        <ellipse cx="54.5" cy="32" rx="2.5" ry="5.5" fill="#EF9F27" />
        <ellipse cx="65.5" cy="32" rx="2.5" ry="5.5" fill="#EF9F27" />
      </svg>
    );
  }

  if (isDrone) {
    // Trubec - Zavalité tělo, obří oči
    return (
      <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
        {/* Nožičky */}
        <path d="M40 54 C24 56 24 50 24 50" className="bee-legs" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round" />
        <path d="M80 54 C96 56 96 50 96 50" className="bee-legs" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round" />
        <path d="M38 72 C22 84 22 94 22 94" className="bee-legs" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round" />
        <path d="M82 72 C98 84 98 94 98 94" className="bee-legs" stroke="#1C1C1C" strokeWidth="4" strokeLinecap="round" />

        {/* Zavalitý zadeček */}
        <ellipse cx="60" cy="80" rx="18" ry="20" fill="#EF9F27" />
        {/* Proužky */}
        <path d="M44 68 Q60 74 76 68" stroke="#1C1C1C" strokeWidth="6" fill="none" />
        <path d="M42 77 Q60 83 78 77" stroke="#1C1C1C" strokeWidth="6" fill="none" />
        <path d="M44 85 Q60 91 76 85" stroke="#1C1C1C" strokeWidth="6" fill="none" />
        <path d="M47 93 Q60 98 73 93" stroke="#1C1C1C" strokeWidth="6" fill="none" />

        {/* Velká hruď */}
        <ellipse cx="60" cy="54" rx="20" ry="15" fill="#C87F15" />
        <ellipse cx="60" cy="54" rx="14" ry="10" fill="#1C1C1C" />

        {/* Obrovská křídla */}
        <ellipse cx="42" cy="44" rx="12" ry="26" transform="rotate(-30 42 44)" fill="#D7EFF7" stroke="#A1D4E6" strokeWidth="2" opacity="0.85" />
        <ellipse cx="78" cy="44" rx="12" ry="26" transform="rotate(30 78 44)" fill="#D7EFF7" stroke="#A1D4E6" strokeWidth="2" opacity="0.85" />

        {/* Hlava */}
        <circle cx="60" cy="34" r="11" fill="#1C1C1C" />
        
        {/* Spojené obří oči */}
        <ellipse cx="52.5" cy="32.5" rx="5" ry="8" transform="rotate(-5 52.5 32.5)" fill="#EF9F27" />
        <ellipse cx="67.5" cy="32.5" rx="5" ry="8" transform="rotate(5 67.5 32.5)" fill="#EF9F27" />
      </svg>
    );
  }

  // Dělnice (Worker) - Klasická včela
  return (
    <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
      {/* Nožičky */}
      <path d="M40 50 C26 52 26 46 26 46" className="bee-legs" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 50 C94 52 94 46 94 46" className="bee-legs" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />
      <path d="M39 68 C22 70 22 64 22 64" className="bee-legs" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />
      <path d="M81 68 C98 70 98 64 98 64" className="bee-legs" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 86 C24 88 24 82 24 82" className="bee-legs" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 86 C96 88 96 82 96 82" className="bee-legs" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />

      {/* Pylové košíčky na zadních nohách */}
      <ellipse cx="26" cy="74" rx="4.5" ry="7" fill="#FF9600" stroke="#1C1C1C" strokeWidth="1.5" />
      <ellipse cx="94" cy="74" rx="4.5" ry="7" fill="#FF9600" stroke="#1C1C1C" strokeWidth="1.5" />

      {/* Středně dlouhý zadeček */}
      <ellipse cx="60" cy="80" rx="15" ry="21" fill="#EF9F27" />
      {/* Proužky */}
      <path d="M47 68 Q60 74 73 68" stroke="#1C1C1C" strokeWidth="3.5" fill="none" />
      <path d="M45 76 Q60 82 75 76" stroke="#1C1C1C" strokeWidth="3.5" fill="none" />
      <path d="M46 84 Q60 90 74 84" stroke="#1C1C1C" strokeWidth="3.5" fill="none" />
      <path d="M49 92 Q60 97 71 92" stroke="#1C1C1C" strokeWidth="3.5" fill="none" />

      {/* Žihadlo */}
      <path d="M60 101 L60 107" stroke="#1C1C1C" strokeWidth="2.5" strokeLinecap="round" />

      {/* Hruď */}
      <ellipse cx="60" cy="50" rx="16" ry="12" fill="#EF9F27" />
      <circle cx="60" cy="50" r="9" fill="#1C1C1C" />

      {/* Křídla */}
      <ellipse cx="44" cy="40" rx="10" ry="22" transform="rotate(-25 44 40)" fill="#D7EFF7" stroke="#A1D4E6" strokeWidth="1.5" opacity="0.8" />
      <ellipse cx="76" cy="40" rx="10" ry="22" transform="rotate(25 76 40)" fill="#D7EFF7" stroke="#A1D4E6" strokeWidth="1.5" opacity="0.8" />

      {/* Hlava */}
      <circle cx="60" cy="33" r="9" fill="#1C1C1C" />
      {/* Tykadla */}
      <path d="M55 25 Q51 17 45 19" stroke="#1C1C1C" strokeWidth="2" fill="none" />
      <path d="M65 25 Q69 17 75 19" stroke="#1C1C1C" strokeWidth="2" fill="none" />
      {/* Složené oči */}
      <ellipse cx="53" cy="32.5" rx="3" ry="6" fill="#EF9F27" />
      <ellipse cx="67" cy="32.5" rx="3" ry="6" fill="#EF9F27" />
    </svg>
  );
};

export default BeeIllustration;
