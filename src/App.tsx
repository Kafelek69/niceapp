import { useState, useEffect } from 'react';
import { Home, Dumbbell, TrendingUp, User, Plus, Trophy, Sparkles, X, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types and static initial workouts
import { Workout, UserStats, FoodEntry, CompletedWorkout } from './types';
import { INITIAL_WORKOUTS } from './data';

// Custom Tab Components
import HomeTab from './components/HomeTab';
import WorkoutsTab from './components/WorkoutsTab';
import ActivityTab from './components/ActivityTab';
import ProfileTab from './components/ProfileTab';

// Player & Quick logger Overlay Components
import WorkoutPlayer from './components/WorkoutPlayer';
import QuickLogModal from './components/QuickLogModal';

const STATS_STORAGE_KEY = 'silent_coach_stats_v1';
const WORKOUTS_STORAGE_KEY = 'silent_coach_workouts_v1';

const DEFAULT_STATS: UserStats = {
  membershipExpiry: "Czerwiec 2024",
  isPremium: true,
  kcalBurnedToday: 1420,
  kcalTarget: 2000,
  waterConsumedToday: 2.1,
  waterTarget: 3.0,
  weight: 80.5,
  weightGoal: 75.0,
  weightHistory: [
    { date: '10.05', value: 81.2 },
    { date: '13.05', value: 80.8 },
    { date: '17.05', value: 80.1 },
    { date: '21.05', value: 79.7 },
    { date: '25.05', value: 80.5 }
  ],
  completedWorkouts: [
    {
      id: 'hist-init-1',
      workoutId: 'chest-back-power',
      workoutTitle: 'Trening Siłowy: Klatka i Plecy',
      date: 'Wczoraj, 18:30 (Log ranny)',
      duration: 45,
      kcalBurned: 480
    }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'workouts' | 'activity' | 'profile'>('home');
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [workouts, setWorkouts] = useState<Workout[]>(INITIAL_WORKOUTS);

  // Overlay workspace states
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [congratsData, setCongratsData] = useState<{ workoutTitle: string; duration: number; kcal: number } | null>(null);

  // 1. Recover cache from localStorage on initial startup
  useEffect(() => {
    try {
      const persistedStats = localStorage.getItem(STATS_STORAGE_KEY);
      if (persistedStats) {
        setStats(JSON.parse(persistedStats));
      } else {
        localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(DEFAULT_STATS));
      }

      const persistedWorkouts = localStorage.getItem(WORKOUTS_STORAGE_KEY);
      if (persistedWorkouts) {
        setWorkouts(JSON.parse(persistedWorkouts));
      } else {
        localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(INITIAL_WORKOUTS));
      }
    } catch (err) {
      console.warn("Storage reading failed, standard offline state loaded.", err);
    }
  }, []);

  // 2. Persist states in deep background when modified
  const updateStats = (newStats: Partial<UserStats>) => {
    setStats(prev => {
      const updated = { ...prev, ...newStats };
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Log water increments & decrements
  const handleIncrementWater = (amt: number) => {
    const nextVal = Number((stats.waterConsumedToday + amt).toFixed(2));
    updateStats({ waterConsumedToday: Math.max(0, nextVal) });
  };

  const handleDecrementWater = (amt: number) => {
    const nextVal = Number((stats.waterConsumedToday - amt).toFixed(2));
    updateStats({ waterConsumedToday: Math.max(0, nextVal) });
  };

  // Add a newly crafted workout from builder
  const handleAddNewWorkout = (newW: Workout) => {
    setWorkouts(prev => {
      const updated = [newW, ...prev];
      localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Complete active logs from the player dashboard
  const handleCompleteActiveWorkout = (durationMin: number, loggedKcal: number) => {
    if (!activeWorkout) return;

    const formattedDate = new Date().toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const completionRecord: CompletedWorkout = {
      id: `compl-${Date.now()}`,
      workoutId: activeWorkout.id,
      workoutTitle: activeWorkout.title,
      date: `Dziś, ${new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`,
      duration: durationMin,
      kcalBurned: loggedKcal
    };

    const nextCompletedList = [...stats.completedWorkouts, completionRecord];
    const nextBurnedKcal = stats.kcalBurnedToday + loggedKcal;

    updateStats({
      completedWorkouts: nextCompletedList,
      kcalBurnedToday: nextBurnedKcal
    });

    // Display high-contrast premium congratulatory dialog
    setCongratsData({
      workoutTitle: activeWorkout.title,
      duration: durationMin,
      kcal: loggedKcal
    });

    // Reset player state
    setActiveWorkout(null);
  };

  // Clear Completed workouts log history
  const handleClearHistory = () => {
    updateStats({ completedWorkouts: [] });
  };

  // Reset all application cache records
  const handleResetAllData = () => {
    localStorage.removeItem(STATS_STORAGE_KEY);
    localStorage.removeItem(WORKOUTS_STORAGE_KEY);
    setStats(DEFAULT_STATS);
    setWorkouts(INITIAL_WORKOUTS);
    setActiveTab('home');
    alert("Dane Silent Coach zresetowane pomyślnie.");
  };

  return (
    <div className="bg-[#131313] min-h-screen text-white relative font-sans overflow-x-hidden">
      
      {/* Outer wrapper to enforce max-width limits and responsive aesthetic spacing on desktop */}
      <div className="w-full max-w-md mx-auto min-h-screen px-5 flex flex-col justify-between relative">
        
        {/* Main Routed views */}
        <div className="flex-1">
          {activeTab === 'home' && (
            <HomeTab 
              stats={stats} 
              workouts={workouts} 
              onStartWorkout={(w) => setActiveWorkout(w)}
              onIncrementWater={handleIncrementWater} 
              onDecrementWater={handleDecrementWater}
            />
          )}

          {activeTab === 'workouts' && (
            <WorkoutsTab 
              workouts={workouts}
              onStartWorkout={(w) => setActiveWorkout(w)}
              onAddNewWorkout={handleAddNewWorkout}
            />
          )}

          {activeTab === 'activity' && (
            <ActivityTab 
              stats={stats}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab 
              stats={stats}
              onUpdateStats={(s) => updateStats(s)}
              onResetAllData={handleResetAllData}
            />
          )}
        </div>

        {/* BOTTOM ACTIVE NAVIGATION TAB BAR */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#1f2020]/90 backdrop-blur-2xl border-t border-white/5 px-4 pb-6 pt-3 flex justify-around items-center z-30">
          
          {/* HOME TAB */}
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center transition-all duration-200 outline-none ${
              activeTab === 'home' 
                ? 'bg-brand-lime text-black rounded-full px-5 py-1.5 font-bold' 
                : 'text-gray-400 hover:text-white px-2 py-1'
            }`}
          >
            <Home size={18} fill={activeTab === 'home' ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-display font-bold uppercase mt-0.5">Home</span>
          </button>

          {/* WORKOUTS TAB */}
          <button 
            onClick={() => setActiveTab('workouts')}
            className={`flex flex-col items-center justify-center transition-all duration-200 outline-none ${
              activeTab === 'workouts' 
                ? 'bg-brand-lime text-black rounded-full px-5 py-1.5 font-bold' 
                : 'text-gray-400 hover:text-white px-2 py-1'
            }`}
          >
            <Dumbbell size={18} />
            <span className="text-[10px] font-display font-bold uppercase mt-0.5">Treningi</span>
          </button>

          {/* ACTIVITY TAB */}
          <button 
            onClick={() => setActiveTab('activity')}
            className={`flex flex-col items-center justify-center transition-all duration-200 outline-none ${
              activeTab === 'activity' 
                ? 'bg-brand-lime text-black rounded-full px-5 py-1.5 font-bold' 
                : 'text-gray-400 hover:text-white px-2 py-1'
            }`}
          >
            <TrendingUp size={18} />
            <span className="text-[10px] font-display font-bold uppercase mt-0.5">Analiza</span>
          </button>

          {/* PROFILE TAB */}
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center transition-all duration-200 outline-none ${
              activeTab === 'profile' 
                ? 'bg-brand-lime text-black rounded-full px-5 py-1.5 font-bold' 
                : 'text-gray-400 hover:text-white px-2 py-1'
            }`}
          >
            <User size={18} />
            <span className="text-[10px] font-display font-bold uppercase mt-0.5">Profil</span>
          </button>
        </nav>

        {/* BOTTOM FLOATING "+" FAST LOG ACTION BUTTON (FAB) */}
        {activeTab !== 'workouts' && (
          <button 
            onClick={() => setShowQuickLog(true)}
            className="fixed bottom-24 right-5 md:right-[calc(50%-200px)] w-14 h-14 bg-brand-lime text-black rounded-full shadow-2xl flex items-center justify-center bloom-button active:scale-95 transition-transform z-30 outline-none shrink-0"
          >
            <Plus size={28} className="stroke-[3]" />
          </button>
        )}

      </div>

      {/* OVERLAY MODULE 1 - IMMERSIVE WORKOUT PLAYER */}
      <AnimatePresence>
        {activeWorkout && (
          <WorkoutPlayer 
            workout={activeWorkout}
            onClose={() => setActiveWorkout(null)}
            onComplete={handleCompleteActiveWorkout}
          />
        )}
      </AnimatePresence>

      {/* OVERLAY MODULE 2 - QUICK RECORDEE SHEET */}
      <AnimatePresence>
        {showQuickLog && (
          <QuickLogModal 
            onClose={() => setShowQuickLog(false)}
            onLogWater={handleIncrementWater}
            onLogKcalBurned={(k) => updateStats({ kcalBurnedToday: stats.kcalBurnedToday + k })}
            onLogFood={(fd) => updateStats({ kcalBurnedToday: Math.max(0, stats.kcalBurnedToday - fd.kcal) })} // Log calories intake decreases burn margin or balances
            onLogWeight={(w) => {
              const formattedDate = new Date().toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
              const nextWeightHistory = [...stats.weightHistory, { date: formattedDate, value: w }].slice(-5); // Keep last 5 entries for the graph
              updateStats({ weight: w, weightHistory: nextWeightHistory });
            }}
            currentWeight={stats.weight}
          />
        )}
      </AnimatePresence>

      {/* OVERLAY MODULE 3 - HIGH INTENSITY CELEBRATION MODAL */}
      <AnimatePresence>
        {congratsData && (
          <div className="fixed inset-0 bg-[#000000f0] backdrop-blur-xl z-50 flex items-center justify-center p-6 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#1e1e1e] border border-brand-lime/35 rounded-3xl p-6 max-w-sm w-full space-y-5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-lime" />
              
              <div className="w-16 h-16 bg-brand-lime/10 border border-brand-lime/20 text-brand-lime flex items-center justify-center rounded-full mx-auto">
                <Trophy size={36} className="animate-bounce" />
              </div>

              <div className="space-y-1">
                <h4 className="font-display font-black text-xl text-white uppercase tracking-tight">KAPITALNA SESJA!</h4>
                <p className="text-gray-400 text-xs font-semibold">Ukończyłeś: {congratsData.workoutTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#131313] p-3 rounded-2xl border border-white/5">
                <div className="text-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block font-display">Czas trwania</span>
                  <span className="font-display font-black text-brand-lime text-lg">{congratsData.duration} min</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block font-display">Spalone Kcal</span>
                  <span className="font-display font-black text-brand-lime text-lg">+{congratsData.kcal} kcal</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed font-medium">Każdy wykonany trening to kolejny krok w kierunku wyznaczonego celu biometrycznego. Utrzymuj żelazną dyscyplinę.</p>

              <button 
                onClick={() => setCongratsData(null)}
                className="w-full py-3.5 bg-brand-lime text-black font-display font-black text-xs rounded-xl hover:bg-brand-lime-dim active:scale-95 transition-all outline-none bloom-button"
              >
                PROWADŹ DALEJ MÓJ PLAN
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
