import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - Lazy initialized Gemini coach feedback
  app.post("/api/coach-advice", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
        return res.json({
          success: false,
          advice: "Aplikacja Silent Coach działa w trybie offline. Skonfiguruj klucz GEMINI_API_KEY w panelu 'Secrets', aby odblokować spersonalizowane, profesjonalne analizy treningowe w czasie rzeczywistym!",
          tips: [
            "Utrzymuj nawodnienie na poziomie powyżej 2.5 litra dziennie przy intensywnym treningu.",
            "Wyciskanie sztangi poziomo połącz z podciąganiem dla lepszej stabilizacji obręczy barkowej.",
            "Po intensywnym treningu uzupełnij węglowodany i łatwostrawne białko w ciągu 45 minut."
          ]
        });
      }

      const { kcalBurned, kcalTarget, waterConsumed, waterTarget, weight, completedCount, activeWorkoutTitle } = req.body;

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Jesteś "Silent Coach" - elitarnym, nieustępliwym, niezwykle profesjonalnym i zwięzłym osobistym trenerem sportowym. Twój styl jest skupiony na wynikach, nowoczesny, bezpośredni i głęboko motywujący. Nie używaj pustej reklamy, mów konkretami.
Dane dzisiejsze zawodnika:
- Spalone kalorie dzisiaj: ${kcalBurned} kcal (Cel: ${kcalTarget} kcal)
- Wypita woda dzisiaj: ${waterConsumed} L (Cel: ${waterTarget} L)
- Aktualna waga ciała: ${weight} kg
- Ukończone sesje treningowe w tym tygodniu: ${completedCount}
- Ostatnio wykonywany trening: ${activeWorkoutTitle || "Brak"}

Napisz krótką, intensywną ocenę postępu dzisiejszego w języku polskim (max 4-5 zdań). Skup się na dyscyplinie, optymalizacji regeneracji, ewentualnym ubytku wody lub kaloriach. Dodatkowo wygeneruj 3 dynamiczne, techniczne, krótkie rady treningowe/nutrition w postaci krótkich haseł (np. "Aktywuj łopatki", "Pij 200ml co 15 minut").

Zwróć odpowiedź w czystym formacie JSON:
{
  "advice": "Twój tekst oceny zawodnika",
  "tips": ["rada 1", "rada 2", "rada 3"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText.trim());

      res.json({
        success: true,
        advice: parsedData.advice || "Świetna robota, trenuj dalej z pełną dyscypliną.",
        tips: parsedData.tips || ["Utrzymuj stabilne tempo", "Pilnuj nawodnienia", "Zwróć uwagę na fazę ekscentryczną"]
      });

    } catch (error: any) {
      console.error("Gemini Coach API error:", error);
      res.status(200).json({
        success: false,
        advice: "Ups! Trener analizuje Twoje dane w skupieniu. Utrzymuj pełną dyscyplinę pomimo braku połączenia sieciowego.",
        tips: [
          "Skoncentruj się na fazie negatywnej (ekscentrycznej) każdego powtórzenia.",
          "Nawodnienie to klucz do przewodnictwa nerwowo-mięśniowego.",
          "Zasypiaj przed godziną 23:00, aby zoptymalizować poziom hormonu wzrostu."
        ]
      });
    }
  });

  // Serve static application inside 'dist' in production or bundle using Vite in dev
  if (process.env.DISABLE_HMR === "true" || process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Silent Coach full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
