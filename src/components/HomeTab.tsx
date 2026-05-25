import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, ShieldCheck, Star, Play, ArrowRight, Bolt, Coffee, GlassWater, Flame, Sparkles, Award } from 'lucide-react';
import { Workout, UserStats, FoodEntry } from '../types';

interface HomeTabProps {
  stats: UserStats;
  workouts: Workout[];
  onStartWorkout: (workout: Workout) => void;
  onIncrementWater: (amt: number) => void;
  onDecrementWater: (amt: number) => void;
}

export default function HomeTab({ 
  stats, 
  workouts, 
  onStartWorkout, 
  onIncrementWater, 
  onDecrementWater 
}: HomeTabProps) {
  const [selectedPlan, setSelectedPlan] = useState<Workout | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState<'all' | 'unread'>('all');

  // Quick Start is Chest & Back Workout (first in array or custom filter)
  const quickStartWorkout = workouts.find(w => w.id === 'chest-back-power') || workouts[0];

  // Simulated notifications
  const notifications = [
    { id: 1, title: "Zadbaj o nawodnienie!", desc: "Nie piłeś wody od 2 godzin. Organizm potrzebuje płynów do sprawnej syntezy białek.", unread: true, time: "10 min temu" },
    { id: 2, title: "Nowy rekord życiowy! 🏆", desc: "Zarejestrowałeś pełny trening klatki i pleców w czasie poniżej 50 minut.", unread: true, time: "Wczoraj" },
    { id: 3, title: "Witaj w Silent Coach Premium", desc: "Twój inteligentny trener personalny AI jest teraz w pełni połączony z Twoją wagą i celami.", unread: false, time: "3 dni temu" },
  ];

  return (
    <div className="space-y-8 font-sans pb-28">
      {/* Top Header App Bar */}
      <header className="flex justify-between items-center bg-[#131313]/90 backdrop-blur-xl border-b border-white/5 py-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#2a2a2a] border border-white/10 shrink-0">
            <img 
              alt="Athlete Female Portrait" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1IQ5KvfS6uf6rEgDIyOhAtn2vSKG7G6BMe5kwmTbvXta9ogrTk1WGnBK_JzeXA9rNo5RjdECiJWSuAj0jEaggZPYmRXTd70Ru0bEBN40oUUe8cbI8wzPn_CH6-GlNeq7rokMTr6zL5659T9YB1JjGL6wgKjmCyv-9HHw_yNSUJl66Z-CjWYXM5Yt1-pzZlGnXG71pvnZojJyGr5TYiEEv5EJ0GIo3xeOdeTvPjXhADOx-vw8XrRsqpC7634vLJgvdPbrnuQeltwNl"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="font-display font-black text-xl tracking-tighter text-brand-lime uppercase">
            SILENT COACH
          </h1>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-400 hover:text-white transition-colors active:scale-95 relative p-1.5 rounded-full hover:bg-white/5"
          >
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-lime rounded-full border-2 border-[#131313]" />
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl p-4 space-y-3 z-30">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h4 className="font-display font-bold text-sm text-white uppercase">POWIADOMIENIA</h4>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-brand-lime font-semibold hover:underline"
                >
                  Zamknij
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 no-scrollbar">
                {notifications.map(n => (
                  <div key={n.id} className={`p-2.5 rounded-lg border text-xs transition-colors ${n.unread ? 'bg-brand-lime/10 border-brand-lime/20' : 'bg-white/5 border-transparent'}`}>
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-white text-xs">{n.title}</p>
                      <span className="text-[9px] text-gray-500 font-medium shrink-0 ml-1">{n.time}</span>
                    </div>
                    <p className="text-gray-400 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Welcome Title */}
      <section className="space-y-1">
        <h2 className="font-display font-black text-3xl text-white tracking-tight">Main Dashboard</h2>
        <p className="text-gray-400 text-sm font-semibold">Witaj z powrotem. Trenuj mądrze i precyzyjnie.</p>
      </section>

      {/* Membership Status Card */}
      <section className="relative overflow-hidden glass-card rounded-2xl p-5 flex flex-col justify-between min-h-[160px]">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-lime/10 rounded-full blur-3xl"></div>
        
        <div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-brand-lime uppercase tracking-widest font-display">
              Status Członkostwa
            </span>
            <ShieldCheck className="text-brand-lime" size={20} />
          </div>
          <p className="font-display font-bold text-2xl mt-2.5 text-white">
            Aktywne do: {stats.membershipExpiry}
          </p>
        </div>

        <div className="flex items-end justify-between mt-6">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full border-2 border-[#131313] bg-[#1e1e1e] flex items-center justify-center text-brand-lime">
              <Star size={14} fill="currentColor" />
            </div>
            <div className="px-3.5 py-1 bg-brand-lime text-black font-display font-black text-[10px] rounded-full tracking-wider uppercase">
              PREMIUM
            </div>
          </div>
          <p className="text-xs text-gray-400 font-semibold">Pozostało 6 miesięcy</p>
        </div>
      </section>

      {/* Quick Start / Today's Workout */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-extrabold text-xl text-white">Szybki Start</h3>
          <button 
            onClick={() => onStartWorkout(quickStartWorkout)} 
            className="text-brand-lime font-semibold text-xs font-display hover:underline uppercase tracking-wider"
          >
            Szybki podgląd
          </button>
        </div>

        <div className="relative group rounded-3xl overflow-hidden aspect-[16/9] glass-card border border-white/10 flex flex-col justify-end p-5">
          <img 
            alt="Today's Active Workout Cover" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
            src={quickStartWorkout.image}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/30 to-transparent" />
          
          <div className="relative z-10 space-y-3 w-full">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-brand-lime text-black font-display font-bold text-[9px] rounded uppercase tracking-tighter">
                DZISIAJ
              </span>
              <span className="text-xs text-white/90 font-medium">
                {quickStartWorkout.duration} min • {quickStartWorkout.level}
              </span>
            </div>

            <h4 className="font-display font-black text-xl md:text-2xl text-white tracking-tight leading-tight">
              {quickStartWorkout.title}
            </h4>

            <button 
              onClick={() => onStartWorkout(quickStartWorkout)}
              className="w-full py-4 bg-brand-lime text-black font-display font-bold text-xs rounded-xl flex items-center justify-center gap-2 bloom-button active:scale-95 transition-all outline-none"
            >
              <Play size={14} fill="currentColor" />
              ROZPOCZNIJ TRENING
            </button>
          </div>
        </div>
      </section>

      {/* Featured Training Plans (Polecane Plany) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-extrabold text-xl text-white">Polecane Plany</h3>
          <span className="text-gray-400"><ArrowRight size={18} /></span>
        </div>

        {/* Scrollable grid */}
        <div className="flex overflow-x-auto no-scrollbar gap-4 -mx-5 px-5 py-2">
          {workouts.map(workout => (
            <div 
              key={workout.id} 
              onClick={() => setSelectedPlan(workout)}
              className="flex-shrink-0 w-60 bg-[#1e1e1e] border border-white/5 hover:border-white/15 rounded-2xl overflow-hidden group cursor-pointer transition-all active:scale-98"
            >
              <div className="h-32 relative">
                <img 
                  alt={workout.title} 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-300"
                  src={workout.image}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#0e0e0ed5] backdrop-blur-md text-[10px] font-bold font-display rounded text-white tracking-widest uppercase">
                  {workout.weeks || "SESJA"}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h5 className="font-display font-bold text-sm text-white group-hover:text-brand-lime transition-colors leading-tight truncate">
                    {workout.title}
                  </h5>
                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-1 font-medium">
                    {workout.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-brand-lime font-display">
                  <Bolt size={12} className="stroke-[3]" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">{workout.level}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics Bento Row */}
      <section className="grid grid-cols-2 gap-4">
        {/* Calorie Card */}
        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between text-center min-h-[140px] relative">
          <span className="text-xs font-display font-bold text-gray-400 uppercase tracking-widest">KCAL Dzisiaj</span>
          
          <div className="my-2">
            <span className="font-display font-black text-3xl text-brand-lime">
              {stats.kcalBurnedToday.toLocaleString()}
            </span>
            <p className="text-[10.5px] text-gray-500 font-semibold mt-0.5">Cel: {stats.kcalTarget} kcal</p>
          </div>

          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-brand-lime transition-all duration-500"
              style={{ width: `${Math.min(100, (stats.kcalBurnedToday / stats.kcalTarget) * 100)}%` }}
            />
          </div>
        </div>

        {/* Water Card */}
        <div className="glass-card p-4 rounded-2xl flex flex-col justify-between text-center min-h-[140px]">
          <span className="text-xs font-display font-bold text-gray-400 uppercase tracking-widest">Woda (L)</span>
          
          <div className="my-2">
            <span className="font-display font-black text-3xl text-brand-lime">
              {stats.waterConsumedToday.toFixed(1)}
            </span>
            <p className="text-[10.5px] text-gray-500 font-semibold mt-0.5">Cel: {stats.waterTarget} L</p>
          </div>

          {/* Incremental control tools */}
          <div className="flex justify-center items-center gap-3">
            <button 
              onClick={() => onDecrementWater(0.25)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center border border-white/5 font-bold font-mono text-white text-xs outline-none"
            >
              -
            </button>
            <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-lime transition-all duration-300"
                style={{ width: `${Math.min(100, (stats.waterConsumedToday / stats.waterTarget) * 100)}%` }}
              />
            </div>
            <button 
              onClick={() => onIncrementWater(0.25)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center border border-white/5 font-bold font-mono text-white text-xs outline-none"
            >
              +
            </button>
          </div>
        </div>
      </section>

      {/* Featured Plan Info Modal Drawer */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-[#0e0e0ec0] backdrop-blur-md z-40 flex items-end justify-center">
          <div className="absolute inset-0" onClick={() => setSelectedPlan(null)} />
          <div className="w-full max-w-md bg-[#131313] border-t border-white/10 rounded-t-3xl p-6 text-white z-10 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar relative">
            <div className="w-12 h-1.5 bg-white/15 rounded-full mx-auto" />
            
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 bg-brand-lime text-black font-display font-bold text-[9px] rounded uppercase tracking-wider">
                  {selectedPlan.level}
                </span>
                <h3 className="font-display font-black text-xl text-white mt-1.5">{selectedPlan.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400"
              >
                Zamknij
              </button>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed font-semibold">{selectedPlan.description}</p>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-display">LISTA ĆWICZEŃ ({selectedPlan.exercises.length})</p>
              <div className="space-y-2">
                {selectedPlan.exercises.map((ex, i) => (
                  <div key={ex.id || i} className="bg-white/5 border border-white/5 p-3 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <span className="text-brand-lime font-bold mr-2">{i+1}.</span>
                      <span className="font-bold text-white">{ex.name}</span>
                    </div>
                    <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded-md text-gray-300 font-semibold shrink-0">
                      {ex.sets}s × {ex.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                onStartWorkout(selectedPlan);
                setSelectedPlan(null);
              }}
              className="w-full py-4 bg-brand-lime text-black font-display font-black text-xs rounded-xl flex items-center justify-center gap-2 bloom-button active:scale-95 transition-all outline-none"
            >
              <Play size={12} fill="currentColor" />
              URUCHOM TEN TRENING (MOC)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
