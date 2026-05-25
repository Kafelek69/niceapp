import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, Target, Settings, Sliders, Scale, Trash2, CheckCircle2, ListCollapse } from 'lucide-react';
import { UserStats } from '../types';

interface ProfileTabProps {
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onResetAllData: () => void;
}

export default function ProfileTab({ stats, onUpdateStats, onResetAllData }: ProfileTabProps) {
  // Goal modification states
  const [kcalGoal, setKcalGoal] = useState(stats.kcalTarget);
  const [waterGoal, setWaterGoal] = useState(stats.waterTarget);
  const [currentWeight, setCurrentWeight] = useState(stats.weight);
  const [goalWeight, setGoalWeight] = useState(stats.weightGoal);
  
  // Custom Coaching Focus state to alter Gemini feedback format!
  const [coachingFocus, setCoachingFocus] = useState<'REDUKCJA' | 'MASA' | 'SIŁA_REKORD'>('REDUKCJA');

  // AI loading and data output states
  const [aiLoading, setAiLoading] = useState(false);
  const [coachAnalysis, setCoachAnalysis] = useState<string>('');
  const [coachTips, setCoachTips] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Load initial stats into settings fields
  useEffect(() => {
    setKcalGoal(stats.kcalTarget);
    setWaterGoal(stats.waterTarget);
    setCurrentWeight(stats.weight);
    setGoalWeight(stats.weightGoal);
  }, [stats]);

  // Handle saving stats targets
  const handleSaveTargets = (e: FormEvent) => {
    e.preventDefault();
    onUpdateStats({
      kcalTarget: kcalGoal,
      waterTarget: waterGoal,
      weight: currentWeight,
      weightGoal: goalWeight
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1500);
  };

  // FETCH AI Feedback from Express Gemini proxy route!
  const handleGenerateCoachAdvice = async () => {
    setAiLoading(true);
    setCoachAnalysis('');
    setCoachTips([]);

    try {
      const response = await fetch('/api/coach-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          kcalBurned: stats.kcalBurnedToday,
          kcalTarget: stats.kcalTarget,
          waterConsumed: stats.waterConsumedToday,
          waterTarget: stats.waterTarget,
          weight: stats.weight,
          completedCount: stats.completedWorkouts.length,
          activeWorkoutTitle: stats.completedWorkouts[stats.completedWorkouts.length - 1]?.workoutTitle || "Brak",
          focus: coachingFocus
        })
      });

      const data = await response.json();
      setCoachAnalysis(data.advice || "Zawsze sprawdzaj swoją formę, dbaj o technikę i trzymaj się planu.");
      setCoachTips(data.tips || ["Utrzymuj stabilne tempo", "Pilnuj nawodnienia", "Regeneruj się"]);
    } catch (error) {
      console.error("Failed to query Express Silent Coach analysis path:", error);
      setCoachAnalysis("Aplikacja działa w trybie lokalnym. Skoncentruj się na regeneracji powięziowej i nawodnieniu.");
      setCoachTips(["Pij 200ml wody co 15 minut", "Zachowaj pełne napięcie korpusu", "Regeneruj stawy"]);
    } finally {
      setAiLoading(false);
    }
  };

  // Immediate coach advisory on mount or fallback
  useEffect(() => {
    // Generate an automatic default coaching paragraph so screen is never empty
    setCoachAnalysis("Witaj w panelu Silent Coach. Kliknij 'WYGENERUJ ANALIZĘ TRENERA AI' poniżej, aby Twój bot-trener przeanalizował aktywne parametry biologiczne w czasie rzeczywistym.");
    setCoachTips([
      "Utrzymuj tętno w strefie cardio podczas interwałów.",
      "Zapisuj wagę zaraz po przebudzeniu na czczo.",
      "Spożywaj 1.8g - 2.2g białka na kg masy ciała przy treningach siłowych."
    ]);
  }, []);

  return (
    <div className="space-y-6 font-sans pb-28">
      {/* Tab Title */}
      <div className="flex justify-between items-center border-b border-white/5 py-4">
        <div>
          <h2 className="font-display font-black text-2xl text-white tracking-tight uppercase">PROFIL ZAWODNIKA</h2>
          <p className="text-gray-400 text-xs font-semibold font-sans">Ustawienia biologiczne, parametry treningu i trener AI</p>
        </div>
      </div>

      {/* Athlete Header */}
      <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-4 flex gap-4 items-center relative overflow-hidden">
        <div className="absolute right-3 top-3 px-2 py-0.5 bg-brand-lime text-black text-[9px] font-display font-black rounded-md uppercase tracking-wider">
          ATHLETE LEVEL 4
        </div>
        
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-lime shrink-0">
          <img 
            alt="User avatar" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1IQ5KvfS6uf6rEgDIyOhAtn2vSKG7G6BMe5kwmTbvXta9ogrTk1WGnBK_JzeXA9rNo5RjdECiJWSuAj0jEaggZPYmRXTd70Ru0bEBN40oUUe8cbI8wzPn_CH6-GlNeq7rokMTr6zL5659T9YB1JjGL6wgKjmCyv-9HHw_yNSUJl66Z-CjWYXM5Yt1-pzZlGnXG71pvnZojJyGr5TYiEEv5EJ0GIo3xeOdeTvPjXhADOx-vw8XrRsqpC7634vLJgvdPbrnuQeltwNl"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div>
          <h3 className="font-display font-bold text-base text-white">Silent Athlete</h3>
          <p className="text-[11px] text-gray-500 font-semibold truncate max-w-[180px]">patrykmarkiewicz2004@gmail.com</p>
          <div className="flex items-center gap-1 mt-1 text-xs">
            <span className="font-bold text-brand-lime font-display text-[10px] uppercase">Status: Premium (6m)</span>
          </div>
        </div>
      </div>

      {/* AI COACH ANALYTICS CONTAINER (Gemini powered) */}
      <section className="bg-brand-lime/10 border-2 border-brand-lime/20 rounded-2xl p-5 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <h4 className="font-display font-black text-xs text-brand-lime uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Sparkles size={14} className="animate-pulse" />
              TRENER OSOBISTY AI
            </h4>
            <p className="text-[10px] text-gray-400 font-semibold uppercase leading-none mt-1">Status: Aktywny na bazie Twoich logów</p>
          </div>

          <select 
            value={coachingFocus}
            onChange={(e) => setCoachingFocus(e.target.value as any)}
            className="bg-[#131313] border border-white/10 text-brand-lime text-[10px] font-bold font-display px-2.5 py-1 rounded outline-none cursor-pointer"
          >
            <option value="REDUKCJA">Redukcja tłuszczu</option>
            <option value="MASA">Budowa masy</option>
            <option value="SIŁA_REKORD">Rozwój siły maks.</option>
          </select>
        </div>

        {/* Generated analysis paragraph */}
        <div className="bg-[#131313]/90 border border-white/5 p-4 rounded-xl space-y-3 min-h-[90px] relative">
          {aiLoading ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-2">
              <div className="w-5 h-5 border-2 border-brand-lime border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-bold tracking-widest font-display text-gray-400 uppercase">Analizowanie logów biologicznych...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-100 leading-relaxed font-semibold italic">
                "{coachAnalysis}"
              </p>
              
              {coachTips.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <p className="text-[9.5px] font-bold text-gray-500 uppercase font-display tracking-widest">WYZNACZONE WYTYCZNE TRENINGOWE:</p>
                  <ul className="space-y-1">
                    {coachTips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-brand-lime flex items-start gap-1.5 font-semibold">
                        <span className="mr-0.5 text-center bg-brand-lime/15 text-brand-lime text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <button 
          onClick={handleGenerateCoachAdvice}
          disabled={aiLoading}
          className="w-full py-3 bg-brand-lime text-black font-display font-black text-xs rounded-xl flex items-center justify-center gap-1.5 tracking-wider hover:bg-brand-lime-dim active:scale-95 transition-all outline-none bloom-button disabled:opacity-50"
        >
          <Sparkles size={13} fill="currentColor" />
          <span>WYGENERUJ ANALIZĘ TRENERA AI</span>
        </button>
      </section>

      {/* Target goals inputs form */}
      <section className="bg-[#1e1e1e] border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-brand-lime" />
          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">Modyfikacja Celi i Biometrii</h4>
        </div>

        {isSaved && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold p-2.5 rounded-xl flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Metryki pomyślnie zaktualizowane!
          </div>
        )}

        <form onSubmit={handleSaveTargets} className="space-y-4.5">
          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase font-display">Target KCAL (Dziennie)</label>
              <input 
                type="number"
                min={100}
                max={9000}
                value={kcalGoal}
                onChange={(e) => setKcalGoal(Number(e.target.value))}
                className="bg-[#131313] border border-white/10 text-white font-extrabold p-3 rounded-xl text-sm outline-none focus:border-brand-lime"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase font-display">Target wody (L / Dzień)</label>
              <input 
                type="number"
                step={0.1}
                min={0.5}
                max={15}
                value={waterGoal}
                onChange={(e) => setWaterGoal(Number(e.target.value))}
                className="bg-[#131313] border border-white/10 text-white font-extrabold p-3 rounded-xl text-sm outline-none focus:border-brand-lime"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase font-display">Bieżąca waga ciała (kg)</label>
              <input 
                type="number"
                step={0.1}
                min={30}
                max={300}
                value={currentWeight}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                className="bg-[#131313] border border-white/10 text-white font-extrabold p-3 rounded-xl text-sm outline-none focus:border-brand-lime"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase font-display">Waga docelowa (kg)</label>
              <input 
                type="number"
                step={0.1}
                min={30}
                max={300}
                value={goalWeight}
                onChange={(e) => setGoalWeight(Number(e.target.value))}
                className="bg-[#131313] border border-white/10 text-white font-extrabold p-3 rounded-xl text-sm outline-none focus:border-brand-lime"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-brand-lime text-black font-display font-black text-xs rounded-xl flex items-center justify-center gap-1.5 uppercase hover:bg-brand-lime-dim active:scale-95 transition-all shadow-lg bloom-button"
          >
            Sfinalizuj i zapisz modyfikację
          </button>
        </form>
      </section>

      {/* Dangerous Operations Zone */}
      <section className="bg-red-500/5 border border-red-500/15 rounded-2xl p-4 space-y-3">
        <h4 className="text-red-400 font-display font-extrabold text-xs uppercase tracking-wider">STREFA NIEBEZPIECZNA</h4>
        <p className="text-[10.5px] text-gray-550 leading-relaxed font-semibold">Te opcje są nieodwracalne i oczyszczają całą bazę lokalnej pamięci podręcznej.</p>
        
        <button 
          onClick={() => {
            if (confirm("Czy na pewno chcesz usunąć wszystkie dane z aplikacji Silent Coach?")) {
              onResetAllData();
            }
          }}
          className="w-full py-3 border border-red-500/20 hover:bg-red-500/10 text-red-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors outline-none cursor-pointer"
        >
          <Trash2 size={13} />
          <span>WYCZYŚĆ WSZYSTKIE REKORDY</span>
        </button>
      </section>
    </div>
  );
}
