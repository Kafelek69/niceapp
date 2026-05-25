import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Plus, X, Search, Filter, ShieldAlert, Check, Play, LayoutGrid } from 'lucide-react';
import { Workout, Exercise, WorkoutLevel } from '../types';

interface WorkoutsTabProps {
  workouts: Workout[];
  onStartWorkout: (workout: Workout) => void;
  onAddNewWorkout: (workout: Workout) => void;
}

export default function WorkoutsTab({ workouts, onStartWorkout, onAddNewWorkout }: WorkoutsTabProps) {
  const [activeFilter, setActiveFilter] = useState<'WSZYSTKIE' | WorkoutLevel>('WSZYSTKIE');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreator, setShowCreator] = useState(false);

  // Creator form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDuration, setNewDuration] = useState(45);
  const [newLevel, setNewLevel] = useState<WorkoutLevel>('ŚREDNI');
  const [newCategory, setNewCategory] = useState('Siła');
  
  // Custom exercises in current creating workspace
  const [workspaceExercises, setWorkspaceExercises] = useState<Omit<Exercise, 'id'>[]>([]);
  const [tempExName, setTempExName] = useState('');
  const [tempExSets, setTempExSets] = useState(4);
  const [tempExReps, setTempExReps] = useState('10');

  const [creatorMsg, setCreatorMsg] = useState('');

  const filteredWorkouts = workouts.filter(w => {
    const levelMatch = activeFilter === 'WSZYSTKIE' || w.level === activeFilter;
    const searchMatch = w.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        w.description.toLowerCase().includes(searchTerm.toLowerCase());
    return levelMatch && searchMatch;
  });

  const handleAddExerciseToWorkspace = () => {
    if (!tempExName) return;
    setWorkspaceExercises(prev => [
      ...prev, 
      { name: tempExName, sets: tempExSets, reps: tempExReps }
    ]);
    setTempExName('');
  };

  const handleRemoveExerciseFromWorkspace = (index: number) => {
    setWorkspaceExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveWorkout = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle || workspaceExercises.length === 0) {
      setCreatorMsg('Musisz podać tytuł i dodać przynajmniej jedno ćwiczenie!');
      return;
    }

    // Hotlinked placeholder image matching physical fitness themes
    const sampleImages = [
      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600'
    ];
    const chosenImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];

    const createdWorkout: Workout = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      description: newDesc || "Mój własny plan stworzony w Silent Coach.",
      duration: newDuration,
      level: newLevel,
      image: chosenImage,
      category: newCategory,
      exercises: workspaceExercises.map((e, idx) => ({ ...e, id: `ex-${idx}-${Date.now()}` }))
    };

    onAddNewWorkout(createdWorkout);
    
    // Reset state & close creator
    setNewTitle('');
    setNewDesc('');
    setNewDuration(45);
    setNewLevel('ŚREDNI');
    setWorkspaceExercises([]);
    setCreatorMsg('');
    setShowCreator(false);
  };

  return (
    <div className="space-y-6 font-sans pb-28">
      {/* Tab Header & Action Banner */}
      <div className="flex justify-between items-center bg-[#131313]/90 sticky top-0 py-4 z-10 border-b border-white/5">
        <div>
          <h2 className="font-display font-black text-2xl text-white tracking-tight uppercase">Rozpiska Treningowa</h2>
          <p className="text-gray-400 text-xs font-semibold">Wybierz gotowy schemat lub skonfiguruj własny</p>
        </div>
        
        <button 
          onClick={() => setShowCreator(true)}
          className="bg-brand-lime text-black py-2.5 px-4 rounded-xl flex items-center gap-1.5 font-display font-bold text-xs hover:bg-brand-lime-dim active:scale-95 transition-all outline-none shadow-lg bloom-button shrink-0"
        >
          <Plus size={14} className="stroke-[3]" />
          <span>NOWY PLAN</span>
        </button>
      </div>

      {/* Control Area: Search & Filters */}
      <div className="space-y-3">
        {/* Search bar */}
        <div className="bg-[#1b1c1c] border border-white/10 rounded-xl flex items-center px-3.5 py-2.5 gap-2.5">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Szukaj treningu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none placeholder-white/35 outline-none flex-1 text-slate-100 placeholder:semibold text-sm"
          />
        </div>

        {/* Level Filters horizontal scroll selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {(['WSZYSTKIE', 'POCZĄTKUJĄCY', 'ŚREDNI', 'ZAAWANSOWANY'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-display text-[10.5px] font-bold shrink-0 tracking-wider transition-all border outline-none ${
                activeFilter === f 
                  ? 'bg-brand-lime border-brand-lime text-black font-extrabold' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Catalog Rendering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map(workout => (
            <div 
              key={workout.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-white/10 hover:border-brand-lime/30 transition-all duration-300"
            >
              <div className="relative h-28 w-full">
                <img 
                  alt={workout.title} 
                  className="w-full h-full object-cover opacity-50"
                  src={workout.image}
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Level Chips */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-display font-black text-black ${
                    workout.level === 'POCZĄTKUJĄCY' ? 'bg-green-400' :
                    workout.level === 'ŚREDNI' ? 'bg-amber-400' : 'bg-red-400'
                  }`}>
                    {workout.level}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-3 px-2 py-0.5 bg-[#0e0e0ed0] backdrop-blur text-[10px] font-bold font-display rounded text-white tracking-widest uppercase">
                  {workout.duration} MINUT
                </div>
              </div>

              {/* Workout Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-base text-white truncate leading-tight">
                    {workout.title}
                  </h4>
                  <p className="text-[11.5px] text-gray-400 line-clamp-2 leading-relaxed font-semibold">
                    {workout.description}
                  </p>
                </div>

                {/* Sub-exercises bullets list and direct Action launch button */}
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-brand-lime">
                    <Dumbbell size={14} />
                    <span className="font-semibold">{workout.exercises.length} ćwiczeń</span>
                  </div>
                  
                  <button 
                    onClick={() => onStartWorkout(workout)}
                    className="h-9 px-4 rounded-lg bg-brand-lime/10 border border-brand-lime/30 hover:bg-brand-lime hover:text-black transition-all flex items-center justify-center gap-1 text-brand-lime text-xs font-display font-bold"
                  >
                    <Play size={10} fill="currentColor" />
                    <span>START</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 text-center py-12 glass-card rounded-2xl space-y-3">
            <ShieldAlert size={40} className="text-gray-500 mx-auto" />
            <p className="text-sm font-semibold text-gray-400">Brak dopasowanych planów treningowych.</p>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">Spróbuj zmodyfikować zapytanie wyszukiwania lub stwórz swój własny plan od zera!</p>
          </div>
        )}
      </div>

      {/* PLAN CREATOR MODAL OVERLAY */}
      <AnimatePresence>
        {showCreator && (
          <div className="fixed inset-0 bg-[#0e0e0ec0] backdrop-blur-md z-40 flex items-end justify-center">
            {/* Click backdrop to exit */}
            <div className="absolute inset-0" onClick={() => setShowCreator(false)} />

            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-[#131313] border-t border-white/10 rounded-t-3xl p-6 text-white z-10 space-y-5 max-h-[92vh] overflow-y-auto no-scrollbar relative"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto" />

              <div className="flex justify-between items-center">
                <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">KREATOR TRENINGÓW</h3>
                <button 
                  onClick={() => setShowCreator(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400"
                >
                  <X size={16} />
                </button>
              </div>

              {creatorMsg && (
                <div className="bg-red-500/25 border border-red-500/30 p-2.5 rounded-lg text-xs text-red-300 font-semibold">
                  {creatorMsg}
                </div>
              )}

              <form onSubmit={handleSaveWorkout} className="space-y-4">
                {/* Plan Title */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-400 uppercase font-display">Tytuł treningu *</label>
                  <input 
                    type="text" 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="np. Szybka Klatka i Triceps"
                    className="bg-[#1b1c1c] border border-white/10 text-white placeholder-white/30 text-sm p-3 rounded-lg outline-none focus:border-brand-lime"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-400 uppercase font-display">Opis (Krótki)</label>
                  <input 
                    type="text" 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Wprowadź krótki opis motywacyjny..."
                    className="bg-[#1b1c1c] border border-white/10 text-white placeholder-white/30 text-sm p-3 rounded-lg outline-none focus:border-brand-lime"
                  />
                </div>

                {/* Duration & Level grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-400 uppercase font-display">Czas trwania (MIN)</label>
                    <input 
                      type="number" 
                      min={10}
                      max={180}
                      value={newDuration}
                      onChange={(e) => setNewDuration(Number(e.target.value))}
                      className="bg-[#1b1c1c] border border-white/10 text-white text-sm p-3 rounded-lg outline-none"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-400 uppercase font-display">Trudność</label>
                    <select 
                      value={newLevel}
                      onChange={(e) => setNewLevel(e.target.value as WorkoutLevel)}
                      className="bg-[#1b1c1c] border border-white/10 text-white text-sm p-3 rounded-lg outline-none cursor-pointer"
                    >
                      <option value="POCZĄTKUJĄCY">Początkujący</option>
                      <option value="ŚREDNI">Średni</option>
                      <option value="ZAAWANSOWANY">Zaawansowany</option>
                    </select>
                  </div>
                </div>

                {/* EXERCISES WORKSPACE BOX */}
                <div className="border border-white/5 rounded-xl p-3 bg-white/5 space-y-4">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-display">DODAJ ĆWICZENIA ({workspaceExercises.length})</h5>

                  {/* Added list */}
                  {workspaceExercises.length > 0 ? (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar pr-1">
                      {workspaceExercises.map((e, idx) => (
                        <div key={idx} className="bg-[#131313] border border-white/5 px-2.5 py-1.5 rounded flex justify-between items-center text-xs">
                          <span className="font-bold truncate max-w-[190px]">{e.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-[10px]">{e.sets}s × {e.reps}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveExerciseFromWorkspace(idx)}
                              className="text-red-500 hover:text-red-400 ml-1.5 font-bold p-1"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-500 font-semibold italic">Użyj formularza poniżej aby dodać ćwiczenia!</p>
                  )}

                  {/* Add action row nested form */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <input 
                      type="text" 
                      placeholder="Nazwa ćwiczenia (np. Przysiady)"
                      value={tempExName}
                      onChange={(e) => setTempExName(e.target.value)}
                      className="w-full bg-[#131313] border border-white/10 text-white text-xs p-2.5 rounded outline-none placeholder-white/30"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0">SERIE:</span>
                        <input 
                          type="number" 
                          min={1} 
                          max={10}
                          value={tempExSets}
                          onChange={(e) => setTempExSets(Number(e.target.value))}
                          className="w-full bg-[#131313] border border-white/10 text-white text-xs p-2.5 rounded text-center"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0">REPS:</span>
                        <input 
                          type="text" 
                          placeholder="np. 10 lub 12"
                          value={tempExReps}
                          onChange={(e) => setTempExReps(e.target.value)}
                          className="w-full bg-[#131313] border border-white/10 text-white text-xs p-2.5 rounded text-center placeholder-white/30"
                        />
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={handleAddExerciseToWorkspace}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded flex items-center justify-center gap-1"
                    >
                      <span>Zatwierdź i dodaj do listy</span>
                      <Check size={12} className="text-brand-lime" />
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button 
                  type="submit"
                  disabled={workspaceExercises.length === 0}
                  className="w-full py-4.5 bg-brand-lime text-black font-display font-black text-xs rounded-xl flex items-center justify-center tracking-wider hover:bg-brand-lime-dim active:scale-95 transition-all disabled:opacity-30 disabled:hover:bg-brand-lime bloom-button outline-none"
                >
                  STWÓRZ I ZAPISZ TEN TRENING (MOC)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
