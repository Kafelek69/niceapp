import { useState } from 'react';
import { motion } from 'motion/react';
import { Award, TrendingUp, Calendar, Trash2, ShieldCheck, Flame, GlassWater, Dumbbell } from 'lucide-react';
import { UserStats, CompletedWorkout } from '../types';

interface ActivityTabProps {
  stats: UserStats;
  onClearHistory: () => void;
}

export default function ActivityTab({ stats, onClearHistory }: ActivityTabProps) {
  const [activeChartTab, setActiveChartTab] = useState<'KCAL' | 'WAGA'>('KCAL');

  const kcalGoalProgress = Math.min(100, (stats.kcalBurnedToday / stats.kcalTarget) * 100);
  const waterGoalProgress = Math.min(100, (stats.waterConsumedToday / stats.waterTarget) * 100);

  // Default weight logs if weightHistory of user stats is empty
  const weightLogs = stats.weightHistory.length > 0 ? stats.weightHistory : [
    { date: '10.05', value: 81.2 },
    { date: '13.05', value: 80.8 },
    { date: '17.05', value: 80.1 },
    { date: '21.05', value: 79.7 },
    { date: '25.05', value: stats.weight }
  ];

  // Quick calorie presets for the last 5 days
  const calorieLogs = [
    { date: 'Pn', value: 1650, target: 1500 },
    { date: 'Wt', value: 1200, target: 1500 },
    { date: 'Śr', value: 1580, target: 1500 },
    { date: 'Cz', value: 1420, target: 1500 },
    { date: 'Pt', value: stats.kcalBurnedToday, target: stats.kcalTarget }
  ];

  // Calculate dynamic average values
  const avgKcalBurned = Math.round(calorieLogs.reduce((acc, c) => acc + c.value, 0) / calorieLogs.length);
  const weightLossTotal = Number((weightLogs[0].value - weightLogs[weightLogs.length - 1].value).toFixed(1));

  return (
    <div className="space-y-6 font-sans pb-28">
      {/* Tab Title */}
      <div className="flex justify-between items-center border-b border-white/5 py-4">
        <div>
          <h2 className="font-display font-black text-2xl text-white tracking-tight uppercase">MONITOR AKTYWNOŚCI</h2>
          <p className="text-gray-400 text-xs font-semibold">Dane historyczne oraz bieżący postęp biologiczny</p>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#1b1c1c] border border-white/5 p-3 rounded-2xl text-center space-y-1">
          <Flame size={18} className="text-brand-lime mx-auto" />
          <p className="text-[9.5px] text-gray-500 font-bold uppercase tracking-wider font-display">ŚR. SPALANIE</p>
          <p className="font-display font-black text-white text-base leading-tight">{avgKcalBurned} kcal</p>
        </div>

        <div className="bg-[#1b1c1c] border border-white/5 p-3 rounded-2xl text-center space-y-1">
          <TrendingUp size={18} className="text-emerald-400 mx-auto" />
          <p className="text-[9.5px] text-gray-500 font-bold uppercase tracking-wider font-display">SPADEK WAGI</p>
          <p className="font-display font-black text-white text-base leading-tight">-{weightLossTotal > 0 ? weightLossTotal : 0} kg</p>
        </div>

        <div className="bg-[#1b1c1c] border border-white/5 p-3 rounded-2xl text-center space-y-1">
          <Award size={18} className="text-brand-lime mx-auto" />
          <p className="text-[9.5px] text-gray-500 font-bold uppercase tracking-wider font-display">STREAK</p>
          <p className="font-display font-black text-white text-base leading-tight">{stats.completedWorkouts.length + 3} dni</p>
        </div>
      </div>

      {/* Interactive Custom SVG Chart Card */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-brand-lime" />
            <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">WYKRESY TRENDU</h4>
          </div>

          <div className="flex bg-[#1b1c1c] p-1 rounded-lg border border-white/5 text-[10px] font-bold font-display">
            <button 
              onClick={() => setActiveChartTab('KCAL')}
              className={`px-3 py-1 rounded transition-all outline-none ${activeChartTab === 'KCAL' ? 'bg-brand-lime text-black font-extrabold' : 'text-gray-400 hover:text-white'}`}
            >
              KCAL
            </button>
            <button 
              onClick={() => setActiveChartTab('WAGA')}
              className={`px-3 py-1 rounded transition-all outline-none ${activeChartTab === 'WAGA' ? 'bg-brand-lime text-black font-extrabold' : 'text-gray-400 hover:text-white'}`}
            >
              WAGA
            </button>
          </div>
        </div>

        {/* KCAL CHART */}
        {activeChartTab === 'KCAL' && (
          <div className="space-y-2">
            <div className="relative w-full h-40 bg-white/5 rounded-xl p-3 flex flex-col justify-between">
              {/* SVG Grid and line */}
              <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Horizontal grid guide lines */}
                <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                
                {/* Simulated Target Threshold */}
                <line x1="0" y1="45" x2="100" y2="45" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2" />

                {/* Main Glowing Curve */}
                <path 
                  d={`M 10,75 L 30,85 L 50,45 L 70,60 L 90,${85 - (stats.kcalBurnedToday / 1500) * 45}`} 
                  fill="none" 
                  stroke="#c3f400" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                
                {/* Glowing points */}
                <circle cx="10" cy="75" r="2.5" fill="#131313" stroke="#c3f400" strokeWidth="1.5" />
                <circle cx="30" cy="85" r="2.5" fill="#131313" stroke="#c3f400" strokeWidth="1.5" />
                <circle cx="50" cy="45" r="2.5" fill="#131313" stroke="#c3f400" strokeWidth="1.5" />
                <circle cx="70" cy="60" r="2.5" fill="#131313" stroke="#c3f400" strokeWidth="1.5" />
                <circle cx="90" cy={85 - (stats.kcalBurnedToday / 1500) * 45} r="3" fill="#c3f400" />
              </svg>

              <div className="absolute top-2 right-2 text-[8.5px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">Cel kaloryczny</div>
            </div>

            {/* Labels under graph */}
            <div className="flex justify-between px-4 text-gray-500 text-[10px] font-bold font-display">
              {calorieLogs.map((c, i) => (
                <div key={i} className="text-center">
                  <span className="block text-white mb-0.5">{c.value}</span>
                  <span>{c.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WEIGHT CHART */}
        {activeChartTab === 'WAGA' && (
          <div className="space-y-2">
            <div className="relative w-full h-40 bg-white/5 rounded-xl p-3 flex flex-col justify-between">
              {/* SVG Grid and line */}
              <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

                {/* Target Weight line */}
                <line x1="0" y1="82" x2="100" y2="82" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3" />

                {/* Weight Loss Downward line */}
                <path 
                  d={`M 10,25 Q 30,35 50,55 T 90,${80 - (stats.weight - 70) * 3}`} 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
                
                {/* Weight points */}
                <circle cx="10" cy="25" r="2.5" fill="#131313" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="50" cy="55" r="2.5" fill="#131313" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="90" cy={80 - (stats.weight - 70) * 3} r="3" fill="#10b981" />
              </svg>

              <div className="absolute top-2 right-2 text-[8.5px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Wycena celu</div>
            </div>

            {/* Weight labels */}
            <div className="flex justify-between px-3 text-gray-500 text-[10px] font-bold font-display">
              {weightLogs.map((w, i) => (
                <div key={i} className="text-center">
                  <span className="block text-white mb-0.5">{w.value}kg</span>
                  <span>{w.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Target Progress bars Detail */}
      <section className="space-y-3">
        <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">Dzisiejsza Realizacja</h4>
        <div className="bg-[#1b1c1c] p-4 rounded-2xl border border-white/5 space-y-4">
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-brand-lime">
                <Flame size={14} /> Bilans spaleń treningowych
              </span>
              <span className="text-white">{stats.kcalBurnedToday} / {stats.kcalTarget} KCAL</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-lime transition-all duration-300" 
                style={{ width: `${kcalGoalProgress}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-400">
                <GlassWater size={14} /> Nawodnienie jelit i mięśni
              </span>
              <span className="text-white">{stats.waterConsumedToday.toFixed(1)} / {stats.waterTarget} L</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300" 
                style={{ width: `${waterGoalProgress}%` }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* HISTORIA TRENINGÓW (History of sessions) */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">HISTORIA TRENINGÓW</h4>
          {stats.completedWorkouts.length > 0 && (
            <button 
              onClick={onClearHistory}
              className="text-[10px] text-red-400 font-bold hover:underline font-display uppercase tracking-widest flex items-center gap-1 outline-none"
            >
              <Trash2 size={10} />
              Wyczyść historię
            </button>
          )}
        </div>

        {stats.completedWorkouts.length > 0 ? (
          <div className="space-y-2">
            {stats.completedWorkouts.slice().reverse().map(log => (
              <div 
                key={log.id}
                className="bg-[#1b1c1c] border border-white/5 p-4 rounded-2xl flex justify-between items-center text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Dumbbell size={14} className="text-brand-lime shrink-0" />
                    <span className="truncate max-w-[190px]">{log.workoutTitle}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold">{log.date}</p>
                </div>

                <div className="text-right shrink-0 space-y-0.5">
                  <span className="block font-display font-black text-brand-lime">+{log.kcalBurned} kcal</span>
                  <span className="block text-[10.5px] text-gray-400 font-bold">{log.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-[#1b1c1c]/40 border border-white/5 rounded-2xl">
            <Dumbbell size={32} className="text-gray-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 font-semibold italic">Brak ukończonych sesji treningowych.</p>
            <p className="text-[10px] text-gray-600 mt-0.5 max-w-xs mx-auto">Kliknij "Start" przy dowolnym treningu i sfinalizuj go, aby zapisać go w historii!</p>
          </div>
        )}
      </section>
    </div>
  );
}
