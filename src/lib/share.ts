export interface ShareCardData {
  levelName: string;
  scoreText: string;
  honeyText?: string;
  rankName: string;
  badgesCount: number;
}

export function drawShareCanvas(
  canvas: HTMLCanvasElement,
  data: ShareCardData,
  lang: "cs" | "pl"
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Nastavit rozměry na 1080x1080px
  canvas.width = 1080;
  canvas.height = 1080;

  // 1. Tmavě zelené pozadí (#0F3D2E)
  ctx.fillStyle = "#0F3D2E";
  ctx.fillRect(0, 0, 1080, 1080);

  // 2. Kreslit medové kružnice/ornament v pozadí
  ctx.strokeStyle = "rgba(232, 184, 75, 0.08)";
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(540, 540, 480, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(232, 184, 75, 0.04)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(540, 540, 420, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Logo "BeeMentor" nahoře (#E8B84B, 48px, bold)
  ctx.fillStyle = "#E8B84B";
  ctx.font = "800 52px Outfit, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("BEEMENTOR", 540, 160);

  // Včelka pod logem
  ctx.fillStyle = "#E8B84B";
  ctx.font = "32px Outfit, sans-serif";
  ctx.fillText("🐝", 540, 220);

  // 4. Název úrvoně (e.g. "Včelí školka")
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 36px Outfit, sans-serif";
  ctx.fillText(data.levelName.toUpperCase(), 540, 360);

  // 5. Velký titulek hráče / Hodnost uprostřed
  ctx.fillStyle = "#E8B84B";
  ctx.font = "800 80px Outfit, sans-serif";
  
  // Přeložit hodnost pro polštinu na canvasu
  let translatedRank = data.rankName;
  if (lang === "pl") {
    switch (data.rankName) {
      case "Vajíčko": translatedRank = "Jajko"; break;
      case "Larva": translatedRank = "Larwa"; break;
      case "Kukla": translatedRank = "Poczwarka"; break;
      case "Létavka": translatedRank = "Pszczoła lotna"; break;
      case "Strážkyně úlu": translatedRank = "Strażniczka ula"; break;
      case "Zkušená včelařka": translatedRank = "Doświadczona pszczelarka"; break;
      case "Mistr včelař": translatedRank = "Mistrz pszczelarski"; break;
    }
  }
  ctx.fillText(translatedRank.toUpperCase(), 540, 480);

  // 6. Skóre ("8 / 10 správně")
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 48px Outfit, sans-serif";
  ctx.fillText(data.scoreText, 540, 600);

  // 7. Med (jen pokud je přítomen, např. "34 kg medu")
  if (data.honeyText) {
    ctx.fillStyle = "#E8B84B";
    ctx.font = "700 38px Outfit, sans-serif";
    ctx.fillText(data.honeyText, 540, 680);
  }

  // 8. Odznaky (řada ikon / bílé kruhy s unicode hvězdičkou)
  const yBadges = data.honeyText ? 800 : 760;
  const badgeCount = Math.min(8, data.badgesCount);
  const badgeSpacing = 60;
  const startX = 540 - ((badgeCount - 1) * badgeSpacing) / 2;

  for (let i = 0; i < badgeCount; i++) {
    const bx = startX + i * badgeSpacing;
    // Kreslit bílé kolečko s hvězdičkou
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(bx, yBadges, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#0F3D2E";
    ctx.font = "20px Outfit, sans-serif";
    ctx.fillText("★", bx, yBadges);
  }

  // 9. Spodní odkaz "beementor.cz"
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 30px Outfit, sans-serif";
  ctx.fillText("beementor.cz", 540, 960);
}

// Funkce pro sdílení canvasu
export async function shareCanvasImage(
  canvas: HTMLCanvasElement,
  title: string,
  text: string
): Promise<boolean> {
  try {
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve(false);
          return;
        }

        const file = new File([blob], "beementor-certifikat.png", { type: "image/png" });

        // Zkontrolovat Web Share API podporu pro soubory
        if (
          navigator.share &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({
              files: [file],
              title,
              text,
            });
            resolve(true);
            return;
          } catch (e) {
            console.warn("Chyba při volání navigator.share:", e);
          }
        }

        // Fallback: stáhnout jako soubor
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "beementor-certifikat.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve(true);
      }, "image/png");
    });
  } catch (err) {
    console.error("Chyba při sdílení certifikátu:", err);
    return false;
  }
}
