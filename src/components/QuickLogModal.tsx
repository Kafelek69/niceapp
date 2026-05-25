import { useState } from 'react';
import { motion } from 'motion/react';
import { X, GlassWater, Dumbbell, Flame, Scale, Coffee, Check, Plus } from 'lucide-react';
import { FoodEntry } from '../types';

interface QuickLogModalProps {
  onClose: () => void;
  onLogWater: (amountLiters: number) => void;
  onLogKcalBurned: (amountKcal: number) => void;
  onLogFood: (entry: Omit<FoodEntry, 'id' | 'time'>) => void;
  onLogWeight: (weight: number) => void;
  currentWeight: number;
}

type LogTab = 'water' | 'food' | 'workout' | 'weight';

export default function QuickLogModal({ 
  onClose, 
  onLogWater, 
  onLogKcalBurned, 
  onLogFood, 
  onLogWeight,
  currentWeight 
}: QuickLogModalProps) {
  const [activeTab, setActiveTab] = useState<LogTab>('water');
  
  // Water local states
  const [waterInput, setWaterInput] = useState(0.25);
  const [waterSuccess, setWaterSuccess] = useState(false);

  // Food local states
  const [foodName, setFoodName] = useState('');
  const [foodKcal, setFoodKcal] = useState(350);
  const [foodSuccess, setFoodSuccess] = useState(false);

  // Workout local states
  const [activityName, setActivityName] = useState('Kardio / Bieganie');
  const [workoutKcal, setWorkoutKcal] = useState(250);
  const [workoutSuccess, setWorkoutSuccess] = useState(false);

  // Weight local states
  const [weightValue, setWeightValue] = useState(currentWeight);
  const [weightSuccess, setWeightSuccess] = useState(false);

  // Auto Reset success indicators after delay
  const triggerSuccess = (setSuccessFn: (b: boolean) => void) => {
    setSuccessFn(true);
    setTimeout(() => {
      setSuccessFn(false);
    }, 1200);
  };

  const handleLogWater = (amt: number) => {
    onLogWater(amt);
    triggerSuccess(setWaterSuccess);
  };

  const handleLogWeight = () => {
    onLogWeight(weightValue);
    triggerSuccess(setWeightSuccess);
  };

  const handleLogFood = () => {
    if (!foodName) return;
    onLogFood({ name: foodName, kcal: foodKcal });
    setFoodName('');
    triggerSuccess(setFoodSuccess);
  };

  const handleLogWorkout = () => {
    onLogKcalBurned(workoutKcal);
    triggerSuccess(setWorkoutSuccess);
  };

  return (
    <div className="fixed inset-0 bg-[#0c0c0cc0] backdrop-blur-md z-40 flex items-end justify-center">
      {/* Tap outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="w-full max-w-md bg-[#131313] rounded-t-3xl border-t border-white/10 z-10 px-6 pt-5 pb-8 space-y-6 text-white overflow-hidden relative"
      >
        {/* Notch decoration */}
        <div className="w-12 h-1.5 bg-white/15 rounded-full mx-auto mb-2" />

        <div className="flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">
            SZYBKIE REJESTROWANIE
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/15 transition-colors text-gray-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-4 gap-2 bg-[#1b1c1c] p-1.5 rounded-xl">
          <button 
            onClick={() => setActiveTab('water')}
            className={`flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'water' ? 'bg-brand-lime text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <GlassWater size={16} />
            <span>Woda</span>
          </button>

          <button 
            onClick={() => setActiveTab('food')}
            className={`flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'food' ? 'bg-brand-lime text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Coffee size={16} />
            <span>Posiłek</span>
          </button>

          <button 
            onClick={() => setActiveTab('workout')}
            className={`flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'workout' ? 'bg-brand-lime text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Dumbbell size={16} />
            <span>Spalanie</span>
          </button>

          <button 
            onClick={() => setActiveTab('weight')}
            className={`flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'weight' ? 'bg-brand-lime text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Scale size={16} />
            <span>Waga</span>
          </button>
        </div>

        {/* Dynamic Log Sections */}
        <div className="min-h-[220px] flex flex-col justify-between">
          
          {/* WATER TAB */}
          {activeTab === 'water' && (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="text-center space-y-2 py-4">
                <GlassWater size={44} className="text-blue-400 mx-auto" />
                <p className="text-sm text-gray-400">Ile wody wypiłeś od ostatniego wpisu?</p>
                <p className="text-3xl font-display font-extrabold text-white">+{waterInput} L</p>
              </div>

              {/* Fast presets */}
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => handleLogWater(0.25)}
                  className="py-3 bg-white/5 hover:bg-white/10 active:scale-95 transition-all rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 border border-white/5"
                >
                  <GlassWater size={14} className="text-blue-400" />
                  +250 ml
                </button>
                <button 
                  onClick={() => handleLogWater(0.5)}
                  className="py-3 bg-white/5 hover:bg-white/10 active:scale-95 transition-all rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 border border-white/5"
                >
                  <GlassWater size={14} className="text-blue-400" />
                  +500 ml
                </button>
                <button 
                  onClick={() => handleLogWater(0.75)}
                  className="py-3 bg-white/5 hover:bg-white/10 active:scale-95 transition-all rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 border border-white/5"
                >
                  <GlassWater size={14} className="text-blue-400" />
                  +750 ml
                </button>
              </div>

              {waterSuccess && (
                <div className="bg-emerald-500/25 border border-emerald-500/50 p-3 rounded-xl flex items-center justify-center gap-2 text-emerald-400 text-sm mt-4">
                  <Check size={16} /> Pomyślnie dodano wodę!
                </div>
              )}
            </div>
          )}

          {/* FOOD TAB */}
          {activeTab === 'food' && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-400 uppercase font-display">Nazwa posiłku / przekąski</label>
                  <input 
                    type="text" 
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="np. Szejk proteinowy z bananem"
                    className="w-full bg-[#1b1c1c] border border-white/10 focus:border-brand-lime text-slate-100 placeholder-white/35 p-3 rounded-xl text-sm outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-400 uppercase font-display">Kaloryczność (KCAL)</label>
                    <span className="text-sm text-brand-lime font-bold font-display">{foodKcal} kcal</span>
                  </div>
                  <input 
                    type="range" 
                    min={50} 
                    max={1200}
                    step={25}
                    value={foodKcal}
                    onChange={(e) => setFoodKcal(Number(e.target.value))}
                    className="w-full accent-brand-lime cursor-pointer mt-2"
                  />
                </div>
              </div>

              <button 
                onClick={handleLogFood}
                disabled={!foodName}
                className="w-full py-4.5 bg-brand-lime text-black font-display font-bold rounded-xl flex items-center justify-center gap-2 mt-4 active:scale-95 transition-all disabled:opacity-40 bloom-button"
              >
                <Plus size={18} />
                <span>ZAPISZ POSIŁEK</span>
              </button>

              {foodSuccess && (
                <div className="bg-emerald-500/25 border border-emerald-500/50 p-3 rounded-xl flex items-center justify-center gap-2 text-emerald-400 text-sm mt-2">
                  <Check size={16} /> Kalorie jedzenia dodane do bazy!
                </div>
              )}
            </div>
          )}

          {/* WORKOUT TAB */}
          {activeTab === 'workout' && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-400 uppercase font-display">Rodzaj aktywności (Quick Burn)</label>
                  <input 
                    type="text" 
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    placeholder="np. Jogging po parku, Rower stacjonarny"
                    className="w-full bg-[#1b1c1c] border border-white/10 focus:border-brand-lime text-slate-100 placeholder-white/35 p-3 rounded-xl text-sm outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-400 uppercase font-display">Spalone Kalorie (KCAL)</label>
                    <span className="text-sm text-brand-lime font-bold font-display">{workoutKcal} kcal</span>
                  </div>
                  <input 
                    type="range" 
                    min={50} 
                    max={1000}
                    step={25}
                    value={workoutKcal}
                    onChange={(e) => setWorkoutKcal(Number(e.target.value))}
                    className="w-full accent-brand-lime cursor-pointer mt-2"
                  />
                </div>
              </div>

              <button 
                onClick={handleLogWorkout}
                className="w-full py-4.5 bg-brand-lime text-black font-display font-bold rounded-xl flex items-center justify-center gap-2 mt-4 active:scale-95 transition-all bloom-button"
              >
                <Flame size={18} />
                <span>ZAPISZ SPALANIE</span>
              </button>

              {workoutSuccess && (
                <div className="bg-emerald-500/25 border border-emerald-500/50 p-3 rounded-xl flex items-center justify-center gap-2 text-emerald-400 text-sm mt-2">
                  <Check size={16} /> Spalone kalorie dodane pomyślnie!
                </div>
              )}
            </div>
          )}

          {/* WEIGHT TAB */}
          {activeTab === 'weight' && (
            <div className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="text-center py-4 space-y-3">
                <Scale size={44} className="text-emerald-400 mx-auto" />
                <p className="text-sm text-gray-400">Zarejestruj dzisiejszą wagę aby śledzić trend</p>
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setWeightValue(prev => Number((prev - 0.1).toFixed(1)))}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 active:scale-95 flex items-center justify-center font-bold font-display text-white text-lg"
                  >
                    -
                  </button>
                  <span className="text-4xl font-display font-black text-white">{weightValue} kg</span>
                  <button 
                    onClick={() => setWeightValue(prev => Number((prev + 0.1).toFixed(1)))}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 active:scale-95 flex items-center justify-center font-bold font-display text-white text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                onClick={handleLogWeight}
                className="w-full py-4.5 bg-brand-lime text-black font-display font-bold rounded-xl flex items-center justify-center gap-2 mt-4 active:scale-95 transition-all bloom-button"
              >
                <Check size={18} />
                <span>ZAKTUALIZUJ WAGĘ</span>
              </button>

              {weightSuccess && (
                <div className="bg-emerald-500/25 border border-emerald-500/50 p-3 rounded-xl flex items-center justify-center gap-2 text-emerald-400 text-sm mt-2">
                  <Check size={16} /> Waga zaktualizowana w historii!
                </div>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
