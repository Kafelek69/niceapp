import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ChevronRight, X, Heart, Trophy, Award, Timer, Volume2, Info } from 'lucide-react';
import { Workout, Exercise } from '../types';

interface WorkoutPlayerProps {
  workout: Workout;
  onClose: () => void;
  onComplete: (durationMinutes: number, kcalBurned: number) => void;
}

export default function WorkoutPlayer({ workout, onClose, onComplete }: WorkoutPlayerProps) {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState(45); // General duration for timer
  const [heartRate, setHeartRate] = useState(128);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [sessionDurationSec, setSessionDurationSec] = useState(0);

  const currentExercise: Exercise = workout.exercises[currentExerciseIdx];

  // Global session duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSessionDurationSec(prev => prev + 1);
        
        // Slightly fluctuate simulated heart rate
        setHeartRate(prev => {
          const change = Math.floor(Math.random() * 7) - 3;
          const target = 110 + (currentExerciseIdx * 8);
          const next = prev + change;
          return Math.min(Math.max(next, 95), 175);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentExerciseIdx]);

  // Exercise time-left countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Auto pulse warning or change
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  // Reset exercise-specific time when moving exercises
  useEffect(() => {
    setTimeLeft(currentExercise?.durationSec || 45);
  }, [currentExerciseIdx, currentExercise]);

  const handleNext = () => {
    if (!completedExercises.includes(currentExercise.id)) {
      setCompletedExercises(prev => [...prev, currentExercise.id]);
    }

    if (currentExerciseIdx < workout.exercises.length - 1) {
      setCurrentExerciseIdx(prev => prev + 1);
    } else {
      // Last exercise completed - finish workout
      handleFinish();
    }
  };

  const handleFinish = () => {
    // Calculate burned calories: ~8.5 kcal per minute, plus heart rate scale
    const activeMinutes = Math.max(1, Math.round(sessionDurationSec / 60));
    const kCalBurned = Math.round(activeMinutes * 9.2 + (heartRate - 100) * 0.4);
    onComplete(activeMinutes, kCalBurned);
  };

  const progressPercent = Math.round(((currentExerciseIdx) / workout.exercises.length) * 100);

  return (
    <div className="fixed inset-0 bg-[#0e0e0e] z-50 text-white flex flex-col justify-between font-sans overflow-y-auto">
      {/* Top Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-white/5 bg-[#131313]/90 sticky top-0 z-10 backdrop-blur">
        <div className="flex flex-col">
          <span className="text-xs font-display text-brand-lime uppercase tracking-widest font-semibold">TRENUJESZ TERAZ</span>
          <h2 className="text-base font-display font-bold text-white truncate max-w-[220px]">{workout.title}</h2>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </header>

      {/* Main workout screen */}
      <main className="flex-1 px-6 py-8 flex flex-col justify-center max-w-lg mx-auto w-full space-y-8">
        {/* Animated Exercise Graphic / Description Box */}
        <section className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-36 h-36 bg-brand-lime/10 rounded-full blur-2xl"></div>
          
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-brand-lime">
              KROK {currentExerciseIdx + 1} z {workout.exercises.length}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <ClockSim sec={sessionDurationSec} />
            </div>
          </div>

          <h3 className="text-2xl font-display font-bold text-white mb-2 leading-tight">
            {currentExercise.name}
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Cel: <span className="text-brand-lime font-bold font-display">{currentExercise.sets} serie</span> x <span className="text-white font-semibold">{currentExercise.reps} powtórzeń</span>
          </p>

          {/* Active stats bar */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
            <div className="bg-[#1b1c1c] p-3 rounded-xl flex items-center gap-3">
              <Timer className="text-brand-lime" size={20} />
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">TIMER SERII</p>
                <p className="font-display font-bold text-lg text-white">
                  {timeLeft}s
                </p>
              </div>
            </div>
            
            <div className="bg-[#1b1c1c] p-3 rounded-xl flex items-center gap-3">
              <Heart className="text-red-500 animate-pulse" size={20} />
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold font-display">TĘTNO (BPM)</p>
                <p className="font-display font-bold text-lg text-white">
                  {heartRate} <span className="text-xs text-red-500/80">▲</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Big visualization area */}
        <section className="flex flex-col items-center justify-center py-4">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Pulsing visual circles */}
            <motion.div 
              animate={{ scale: isPlaying ? [1, 1.15, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-brand-lime/5 rounded-full"
            />
            <motion.div 
              animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.3 }}
              className="absolute inset-4 bg-brand-lime/10 rounded-full"
            />
            
            {/* Inner countdown face */}
            <div className="absolute inset-8 rounded-full bg-[#1b1c1c] border-2 border-brand-lime flex flex-col items-center justify-center shadow-xl">
              <span className="text-3xl font-display font-bold text-slate-100">{timeLeft}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">sekund</span>
            </div>
          </div>
        </section>

        {/* Exercise target checklist */}
        <section className="space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ruchy i zalecenia:</p>
          <div className="bg-[#1b1c1c]/60 p-4 rounded-xl space-y-3 border border-white/5">
            <div className="flex items-start gap-2 text-sm text-gray-300">
              <Award className="text-brand-lime shrink-0 mt-0.5" size={16} />
              <span>Zachowaj pełną gamę ruchu i stałe napięcie brzucha.</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-300">
              <Info className="text-blue-400 shrink-0 mt-0.5" size={16} />
              <span>Wydech przy wysiłku (faza koncentryczna), głęboki wdech przy powrocie.</span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Control Bar */}
      <footer className="p-6 bg-[#131313] border-t border-white/5 sticky bottom-0 z-10">
        {/* Progress gauge */}
        <div className="w-full h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-brand-lime transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex gap-4 max-w-md mx-auto">
          {/* Pause / Play */}
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          {/* Core main button */}
          <button 
            onClick={handleNext}
            className="flex-1 h-16 bg-brand-lime text-black font-display font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-lime-dim active:scale-95 transition-all bloom-button"
          >
            <span>
              {currentExerciseIdx === workout.exercises.length - 1 ? "ZAKOŃCZ TRENING" : "NASTĘPNE ĆWICZENIE"}
            </span>
            <ChevronRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}

function ClockSim({ sec }: { sec: number }) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return (
    <span className="font-mono text-xs text-gray-400">
      CZAS: {m < 10 ? '0' : ''}{m}:{s < 10 ? '0' : ''}{s}
    </span>
  );
}
