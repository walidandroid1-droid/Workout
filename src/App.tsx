import { useEffect, useState, useRef } from 'react';
import { 
  Dumbbell, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Shield, 
  Trophy, 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  Info, 
  Clock, 
  Flame, 
  Award, 
  Trash2, 
  CheckCircle, 
  ListTodo, 
  Sparkles, 
  Activity, 
  Check, 
  SkipForward 
} from 'lucide-react';

import { LevelType, WorkoutPhase, Exercise, WarmupExercise, CooldownExercise, WorkoutHistoryEntry, WeekSettings } from './types';
import { MAIN_EXERCISES, WARMUP_EXERCISES, COOLDOWN_EXERCISES, WEEK_PLAN_SETTINGS } from './data/exercises';
import { ExerciseAnimator } from './components/ExerciseAnimator';
import { WorkoutStats } from './components/WorkoutStats';
import { initAudio, playTactileClick, playCountDownBeep, playStartBeep, playCompletionFanfare, speak, getVoiceEnabled, setVoiceEnabled } from './utils/audio';

export default function App() {
  // Current screen
  const [screen, setScreen] = useState<'SETUP' | 'WORKOUT' | 'STATS'>('SETUP');

  // Workout configuration states
  const [selectedLevel, setSelectedLevel] = useState<LevelType>('INTERMEDIAIRE');
  const [selectedWeekIdx, setSelectedWeekIdx] = useState<number>(0); // Semaine 1-2 default
  const [customRounds, setCustomRounds] = useState<number>(3);
  const [customRest, setCustomRest] = useState<number>(30);
  const [includeWarmup, setIncludeWarmup] = useState<boolean>(true);
  const [includeCooldown, setIncludeCooldown] = useState<boolean>(true);
  const [voiceCoach, setVoiceCoach] = useState<boolean>(true);

  // Active workout states
  const [currentPhase, setCurrentPhase] = useState<WorkoutPhase>('SETUP');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [exerciseIndex, setExerciseIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState<number>(0);
  const [exercisesCompletedHistory, setExercisesCompletedHistory] = useState<number>(0);

  // Stats & local history state
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryEntry[]>([]);
  const [showGoldenRules, setShowGoldenRules] = useState<boolean>(false);

  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and load user local history
  useEffect(() => {
    try {
      const stored = localStorage.getItem('military_workout_history_v1');
      if (stored) {
        setWorkoutHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to retrieve previous workout logs from safari localStorage:", e);
    }
  }, []);

  // Update default rounds & rest when Week changes
  useEffect(() => {
    const config = WEEK_PLAN_SETTINGS[selectedWeekIdx];
    if (config) {
      setCustomRounds(config.defaultRounds);
      setCustomRest(config.restBetweenExos);
    }
  }, [selectedWeekIdx]);

  // Synchronize audio configuration
  useEffect(() => {
    setVoiceEnabled(voiceCoach);
  }, [voiceCoach]);

  // Main high-precision countdown loop
  useEffect(() => {
    if (screen === 'WORKOUT' && !isPaused && currentPhase !== 'COMPLETED') {
      timerRef.current = setInterval(() => {
        // Increment general counter
        setTotalElapsedSeconds(prev => prev + 1);

        // Decrement step counter
        setTimerSeconds(prev => {
          // Audio ticks at 3, 2, 1 seconds on critical timers
          if (prev > 1 && prev <= 4) {
            playCountDownBeep();
          }

          if (prev <= 1) {
            // Trigger phase changes
            setTimeout(() => {
              handleNextStep();
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, isPaused, currentPhase, currentRound, exerciseIndex]);

  // Dynamic repetition calculation based on Level Factor
  const calculateRepsForLevel = (item: Exercise) => {
    let factorMin = 0.5;
    let factorMax = 1.0;

    if (selectedLevel === 'DEBUTANT') {
      factorMin = 0.35;
      factorMax = 0.40;
    } else if (selectedLevel === 'INTERMEDIAIRE') {
      factorMin = 0.70;
      factorMax = 0.80;
    } else { // AVANCE
      factorMin = 1.0;
      factorMax = 1.15;
    }

    const computedMin = Math.max(1, Math.round(item.minReps * factorMin));
    const computedMax = Math.round(item.maxReps * factorMax);

    if (item.id === 4) {
      return `${computedMin} à ${computedMax} rép par jambe`;
    }

    return `${computedMin} à ${computedMax} répétitions`;
  };

  // Determine standard time limit for duration workouts
  const calculateDurationForLevel = (item: Exercise) => {
    const baseVal = item.baseDuration || 30;
    if (selectedLevel === 'DEBUTANT') return Math.round(baseVal * 0.75); // e.g. 25s for climbers
    if (selectedLevel === 'INTERMEDIAIRE') return baseVal; // e.g. 30s / 45s
    return Math.round(baseVal * 1.3); // e.g. 40s / 60s for advanced
  };

  // Safe initiation of audio and workout sequences
  const handleStartWorkout = () => {
    initAudio();
    playStartBeep();
    setTotalElapsedSeconds(0);
    setExercisesCompletedHistory(0);
    setCurrentRound(1);
    setExerciseIndex(0);
    setIsPaused(false);

    if (includeWarmup) {
      setCurrentPhase('WARMUP');
      setTimerSeconds(WARMUP_EXERCISES[0].duration);
      speak("Début de l'entraînement. Échauffement numéro un : " + WARMUP_EXERCISES[0].name);
    } else {
      setCurrentPhase('ACTIVE_EXERCISE');
      const firstEx = MAIN_EXERCISES[0];
      const duration = firstEx.isTimeBased ? calculateDurationForLevel(firstEx) : 40; // 40s time limit for reps
      setTimerSeconds(duration);
      speak("Début du circuit. Exercice un : " + firstEx.name + ". C'est parti !");
    }

    setScreen('WORKOUT');
  };

  // Transition engine
  const handleNextStep = () => {
    playStartBeep();
    
    // 1. Warmup workflow
    if (currentPhase === 'WARMUP') {
      const nextIdx = exerciseIndex + 1;
      if (nextIdx < WARMUP_EXERCISES.length) {
        setExerciseIndex(nextIdx);
        setTimerSeconds(WARMUP_EXERCISES[nextIdx].duration);
        speak("Échauffement suivant : " + WARMUP_EXERCISES[nextIdx].name);
      } else {
        // Transition to main circuit
        setExerciseIndex(0);
        setCurrentPhase('ACTIVE_EXERCISE');
        const firstEx = MAIN_EXERCISES[0];
        const duration = firstEx.isTimeBased ? calculateDurationForLevel(firstEx) : 40;
        setTimerSeconds(duration);
        speak("Échauffement terminé. Préparez-vous pour l'exercice un : " + firstEx.name);
      }
    } 
    // 2. Core Exercise workflow
    else if (currentPhase === 'ACTIVE_EXERCISE') {
      setExercisesCompletedHistory(prev => prev + 1);
      const isLastExercise = exerciseIndex === MAIN_EXERCISES.length - 1;
      
      if (isLastExercise) {
        // End of round
        const isLastRound = currentRound === customRounds;
        if (isLastRound) {
          if (includeCooldown) {
            setCurrentPhase('COOLDOWN');
            setExerciseIndex(0);
            setTimerSeconds(COOLDOWN_EXERCISES[0].duration);
            speak("Circuit militaire terminé. Début de la phase de retour au calme : " + COOLDOWN_EXERCISES[0].name);
          } else {
            handleCompleteWorkout();
          }
        } else {
          // Break between rounds
          setCurrentPhase('ROUND_REST');
          setTimerSeconds(50); // 45-60 seconds specified on poster
          speak(`Tour ${currentRound} complété. Reposez-vous avant le prochain tour.`);
        }
      } else {
        // Rest between normal exercises in same round
        setCurrentPhase('ACTIVE_REST');
        setTimerSeconds(customRest);
        const nextExName = MAIN_EXERCISES[exerciseIndex + 1].name;
        speak(`Exercice validé. Repos. Prochain exercice : ${nextExName}`);
      }
    } 
    // 3. Normal Rest workflow
    else if (currentPhase === 'ACTIVE_REST') {
      const nextIdx = exerciseIndex + 1;
      setExerciseIndex(nextIdx);
      setCurrentPhase('ACTIVE_EXERCISE');
      
      const activeEx = MAIN_EXERCISES[nextIdx];
      const duration = activeEx.isTimeBased ? calculateDurationForLevel(activeEx) : 40;
      setTimerSeconds(duration);
      speak(`${activeEx.name}. Contractez les abdominaux, c'est parti !`);
    } 
    // 4. Round Rest completion
    else if (currentPhase === 'ROUND_REST') {
      setCurrentRound(prev => prev + 1);
      setExerciseIndex(0);
      setCurrentPhase('ACTIVE_EXERCISE');
      
      const firstEx = MAIN_EXERCISES[0];
      const duration = firstEx.isTimeBased ? calculateDurationForLevel(firstEx) : 40;
      setTimerSeconds(duration);
      speak(`Début du tour ${currentRound + 1}. Exercice un : ${firstEx.name}`);
    } 
    // 5. Cooldown workflow
    else if (currentPhase === 'COOLDOWN') {
      const nextIdx = exerciseIndex + 1;
      if (nextIdx < COOLDOWN_EXERCISES.length) {
        setExerciseIndex(nextIdx);
        setTimerSeconds(COOLDOWN_EXERCISES[nextIdx].duration);
        speak("Retour au calme suivant : " + COOLDOWN_EXERCISES[nextIdx].name);
      } else {
        handleCompleteWorkout();
      }
    }
  };

  // Backwards navigation (allow user to restart or adjust active execution)
  const handlePrevStep = () => {
    playTactileClick();
    if (currentPhase === 'ACTIVE_REST') {
      // Go back to the exercise we just completed
      setCurrentPhase('ACTIVE_EXERCISE');
      const activeEx = MAIN_EXERCISES[exerciseIndex];
      const duration = activeEx.isTimeBased ? calculateDurationForLevel(activeEx) : 40;
      setTimerSeconds(duration);
    } else if (currentPhase === 'ACTIVE_EXERCISE' && exerciseIndex > 0) {
      // Go back to rest of previous exercise
      setCurrentPhase('ACTIVE_REST');
      setExerciseIndex(exerciseIndex - 1);
      setTimerSeconds(customRest);
    } else if (currentPhase === 'WARMUP' && exerciseIndex > 0) {
      setExerciseIndex(exerciseIndex - 1);
      setTimerSeconds(WARMUP_EXERCISES[exerciseIndex - 1].duration);
    }
  };

  // Skip active rest timers immediately
  const handleSkipTimer = () => {
    playTactileClick();
    handleNextStep();
  };

  // Complete workout logic - saves in history
  const handleCompleteWorkout = () => {
    playCompletionFanfare();
    setCurrentPhase('COMPLETED');
    
    const weekLabel = WEEK_PLAN_SETTINGS[selectedWeekIdx].label;
    const newEntry: WorkoutHistoryEntry = {
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      level: selectedLevel,
      roundsCount: customRounds,
      completedExercisesCount: exercisesCompletedHistory || 10,
      totalDurationSeconds: totalElapsedSeconds || 900,
      weekRange: weekLabel
    };

    const updatedHistory = [newEntry, ...workoutHistory];
    setWorkoutHistory(updatedHistory);
    
    try {
      localStorage.setItem('military_workout_history_v1', JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn("Storage failed:", e);
    }

    speak("Félicitations soldat ! Entraînement militaire accompli avec succès. Force et honneur !");
  };

  const handleClearHistory = () => {
    setWorkoutHistory([]);
    try {
      localStorage.removeItem('military_workout_history_v1');
    } catch(e) {}
  };

  // Get active workout info
  const getActiveStateDetails = () => {
    if (currentPhase === 'WARMUP') {
      const ex = WARMUP_EXERCISES[exerciseIndex];
      return {
        title: "ÉCHAUFFEMENT MANDATAIRE",
        subtitle: `EXO ${exerciseIndex + 1} / ${WARMUP_EXERCISES.length}`,
        name: ex.name,
        target: "30 secondes",
        desc: ex.description,
        tips: "Préchauffez les articulations sans à-coups."
      };
    }
    
    if (currentPhase === 'ACTIVE_EXERCISE') {
      const ex = MAIN_EXERCISES[exerciseIndex];
      return {
        title: `TOUR ${currentRound} SUR ${customRounds}`,
        subtitle: `EXERCICE ${exerciseIndex + 1} SUR ${MAIN_EXERCISES.length}`,
        name: ex.name,
        target: ex.isTimeBased ? `${calculateDurationForLevel(ex)} SEC` : calculateRepsForLevel(ex),
        desc: ex.description,
        tips: ex.tips
      };
    }

    if (currentPhase === 'ACTIVE_REST') {
      const nextEx = MAIN_EXERCISES[exerciseIndex + 1];
      return {
        title: "PÉRIODE DE RÉCUPÉRATION",
        subtitle: "PROCHAIN EXERCICE",
        name: nextEx ? nextEx.name : "Fin du cycle",
        target: `${timerSeconds}s restantes`,
        desc: nextEx ? nextEx.description : "",
        tips: `Installez-vous en position pour faire des ${nextEx ? nextEx.name : 'étirements'}.`
      };
    }

    if (currentPhase === 'ROUND_REST') {
      return {
        title: "FIN DU TOUR",
        subtitle: `TOUR ${currentRound} COMPLÉTÉ`,
        name: "TEMPS DE RESPIRATION",
        target: `${timerSeconds}s restantes`,
        desc: "Hydratez-vous par petites gorgées de 2 à 3 centilitres maximum pour éviter les ballonnements.",
        tips: "Préparez votre esprit pour le tour suivant. 100% d'engagement !"
      };
    }

    if (currentPhase === 'COOLDOWN') {
      const ex = COOLDOWN_EXERCISES[exerciseIndex];
      return {
        title: "RETOUR AU CALME",
        subtitle: `PHASE ${exerciseIndex + 1} / ${COOLDOWN_EXERCISES.length}`,
        name: ex.name,
        target: "40 secondes",
        desc: ex.description,
        tips: "Ralentissez le rythme cardiaque et appréciez l'effort accompli."
      };
    }

    return {
      title: "",
      subtitle: "",
      name: "",
      target: "",
      desc: "",
      tips: ""
    };
  };

  const ad = getActiveStateDetails();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-2 sm:py-6 px-1.5 sm:px-4 font-sans select-none antialiased">
      {/* 
        PREMIUM RESPONSIVE WRAPPER:
        Acts as an elegant tactile iPhone chassis mockup on large screens,
        but completely fills the display with immersive dark/military styling on actual mobile phones.
      */}
      <div className="w-full max-w-[440px] h-[920px] max-h-[96dvh] bg-slate-950 sm:border-[10px] sm:border-slate-800 sm:rounded-[50px] shadow-2xl shadow-emerald-950/20 relative flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Mock iPhone details: Sensor Notch & Speaker Bar (Hidden on mobile browsers) */}
        <div className="hidden sm:flex absolute top-0 inset-x-0 h-8 justify-center items-start z-50 pointer-events-none">
          <div className="w-36 h-5.5 bg-slate-800 rounded-b-2xl flex items-center justify-center gap-1.5 px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
            <div className="w-10 h-1 bg-slate-900 rounded-full"></div>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-950"></span>
          </div>
        </div>

        {/* Home Screen indicator & safe spacer */}
        <div className="hidden sm:block h-6 bg-slate-950"></div>

        {/* APP CONTENT BAR */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 text-slate-100">
          
          {/* SETUP SCREEN */}
          {screen === 'SETUP' && (
            <div className="flex-1 flex flex-col overflow-y-auto px-4 pb-6 scrollbar-none">
              
              {/* Header Title */}
              <div className="text-center pt-3 pb-4">
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-emerald-400 font-black tracking-[0.25em] uppercase">
                  <Shield className="w-4 h-4 fill-emerald-950/40 animate-pulse text-emerald-400" />
                  PROTOCOLE MILITAIRE
                </div>
                <h1 className="text-3xl font-black font-mono tracking-tighter text-slate-100 mt-1 uppercase text-shadow-sm">
                  WORKOUT <span className="text-emerald-500">CORPS SEC</span>
                </h1>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[320px] mx-auto leading-relaxed">
                  Basé sur l'entraînement militaire officiel : 15-20 min par jour, 8 semaines de discipline.
                </p>
              </div>

              {/* Stat Briefing Row */}
              <div className="w-full bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3 mb-4 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-950/60 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Missions faites</div>
                    <div className="text-slate-200 font-bold">{workoutHistory.length} rituels</div>
                  </div>
                </div>
                <button
                  onClick={() => { playTactileClick(); setScreen('STATS'); }}
                  className="px-3 py-1.5 bg-slate-800 text-emerald-400 font-bold rounded-lg border border-slate-700/60 text-xs active:scale-95 transition-all"
                >
                  Dossier Grade
                </button>
              </div>

              {/* Step 1: Week Selector */}
              <div className="mb-4">
                <label className="block text-[11px] font-mono font-bold text-slate-400 tracking-wider uppercase mb-2">
                  Étape 1 : Progression du programme (8 semaines)
                </label>
                <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {WEEK_PLAN_SETTINGS.map((setting, idx) => (
                    <button
                      key={setting.label}
                      onClick={() => { playTactileClick(); setSelectedWeekIdx(idx); }}
                      className={`py-2 rounded-lg text-center flex flex-col items-center justify-center transition-all ${
                        selectedWeekIdx === idx 
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20' 
                          : 'text-slate-400 hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="text-[10px] font-bold font-mono tracking-widest uppercase">SEM</span>
                      <span className="text-xs font-extrabold font-mono mt-0.5">
                        {setting.label.includes('1-2') ? '1-2' : setting.label.includes('3-4') ? '3-4' : setting.label.includes('5-6') ? '5-6' : setting.label.includes('7') ? '7' : '8'}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Week Brief Details */}
                <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 mt-2 text-xs">
                  <div className="flex justify-between items-center text-emerald-400 font-mono font-bold uppercase text-[10px]">
                    <span>🎯 {WEEK_PLAN_SETTINGS[selectedWeekIdx].title}</span>
                    <span>FOCUS : {WEEK_PLAN_SETTINGS[selectedWeekIdx].focus}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {WEEK_PLAN_SETTINGS[selectedWeekIdx].objective}. Repos imposé entre les exercices : <strong className="text-slate-200">{WEEK_PLAN_SETTINGS[selectedWeekIdx].restBetweenExos}s</strong>.
                  </p>
                </div>
              </div>

              {/* Step 2: Level Selector */}
              <div className="mb-4">
                <label className="block text-[11px] font-mono font-bold text-slate-400 tracking-wider uppercase mb-2">
                  Étape 2 : Niveau de force
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'] as LevelType[]).map((level) => {
                    const active = selectedLevel === level;
                    const desc = level === 'DEBUTANT' ? '30-40% des reps' : level === 'INTERMEDIAIRE' ? '70-80% des reps' : '100% + rajouts';
                    return (
                      <button
                        key={level}
                        onClick={() => { playTactileClick(); setSelectedLevel(level); }}
                        className={`p-2.5 rounded-xl text-left border flex flex-col justify-between h-18 cursor-pointer transition-all ${
                          active 
                            ? 'bg-gradient-to-br from-emerald-950/30 to-emerald-900/10 border-emerald-500 shadow-md shadow-emerald-500/10' 
                            : 'bg-slate-900 hover:bg-slate-900/80 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className={`text-[10px] font-bold font-mono tracking-wider ${active ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {level}
                        </span>
                        <span className="text-[9px] text-slate-400 font-sans leading-none mt-1">
                          {desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Round Customizer & Options */}
              <div className="mb-4 bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-xs font-mono font-bold text-slate-400">NOMBRE DE TOURS</div>
                  <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    <button 
                      onClick={() => { playTactileClick(); setCustomRounds(r => Math.max(1, r - 1)); }}
                      className="text-slate-400 hover:text-white px-2 font-black"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold text-emerald-400 w-4 text-center">{customRounds}</span>
                    <button 
                      onClick={() => { playTactileClick(); setCustomRounds(r => Math.min(6, r + 1)); }}
                      className="text-slate-400 hover:text-white px-2 font-black"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div className="text-xs font-mono font-bold text-slate-400">REPOS ENTRE EXOS</div>
                  <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                    <button 
                      onClick={() => { playTactileClick(); setCustomRest(r => Math.max(10, r - 5)); }}
                      className="text-slate-400 hover:text-white px-1.5 font-bold text-[10px]"
                    >
                      -5s
                    </button>
                    <span className="text-xs font-mono font-bold text-emerald-400 w-8 text-center">{customRest}s</span>
                    <button 
                      onClick={() => { playTactileClick(); setCustomRest(r => Math.min(90, r + 5)); }}
                      className="text-slate-400 hover:text-white px-1.5 font-bold text-[10px]"
                    >
                      +5s
                    </button>
                  </div>
                </div>

                {/* Additional option toggles */}
                <div className="border-t border-slate-800/80 pt-3.5 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Échauffement initial (3 min)</span>
                    <input 
                      type="checkbox" 
                      checked={includeWarmup}
                      onChange={(e) => { playTactileClick(); setIncludeWarmup(e.target.checked); }}
                      className="accent-emerald-500 rounded text-emerald-500 h-4 w-4 bg-slate-950 border-slate-850"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Retour au calme (2 min)</span>
                    <input 
                      type="checkbox" 
                      checked={includeCooldown}
                      onChange={(e) => { playTactileClick(); setIncludeCooldown(e.target.checked); }}
                      className="accent-emerald-500 rounded text-emerald-500 h-4 w-4 bg-slate-950 border-slate-850"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Coach Vocal Français Actif</span>
                    <button 
                      onClick={() => { playTactileClick(); setVoiceCoach(!voiceCoach); }}
                      className={`p-1 rounded-md transition-all ${voiceCoach ? 'text-emerald-400' : 'text-slate-600'}`}
                    >
                      {voiceCoach ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Golden Rules (Règles d'or & Nutrition) */}
              <div className="mb-4">
                <button
                  onClick={() => { playTactileClick(); setShowGoldenRules(!showGoldenRules); }}
                  className="w-full text-left py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-300 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-400" /> RÈGLES D'OR & NUTRITION DU PROTOCOLE
                  </span>
                  <span>{showGoldenRules ? 'REPLIER [-]' : 'AFFICHER [+]'}</span>
                </button>

                {showGoldenRules && (
                  <div className="p-3 bg-slate-900/40 border border-t-0 border-slate-800 rounded-b-xl space-y-3.5 text-xs text-slate-400 leading-relaxed">
                    <div>
                      <div className="font-bold text-emerald-400 font-mono mb-1 uppercase tracking-wide">Règles d'Or Militaire :</div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>⭐ <strong className="text-slate-300">Donne 100%</strong> de tes capacités chaque jour.</li>
                        <li>⭐ <strong className="text-slate-300">Reste régulier</strong> : l'assiduité bat le talent.</li>
                        <li>⭐ <strong className="text-slate-300">Dors 7-8h</strong> par nuit pour la récupération nerveuse.</li>
                        <li>⭐ <strong className="text-slate-300">ZÉRO EXCUSE !</strong> La douleur passe, la fierté reste.</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-400 font-mono mb-1 uppercase tracking-wide">Nutrition & Hydratation :</div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>💧 <strong className="text-slate-300">Mange Propre :</strong> Privilégie protéines maigres, légumes verts, bonnes graisses (avocat, amandes), diminue drastiquement le sucre raffiné.</li>
                        <li>💧 <strong className="text-slate-300">Boire beaucoup d'eau :</strong> Consomme 2 à 3 litres d'eau tout au long de la journée pour lubrifier tes muscles.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Start Trigger Button */}
              <div className="mt-auto">
                <button
                  onClick={handleStartWorkout}
                  className="w-full py-3.5 bg-emerald-500 text-slate-950 font-black rounded-xl text-sm font-mono tracking-widest uppercase hover:bg-emerald-400 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current text-slate-950" /> COMMENCER LA SESSION
                </button>
              </div>

            </div>
          )}

          {/* ACTIVE WORKOUT PANEL */}
          {screen === 'WORKOUT' && currentPhase !== 'COMPLETED' && (
            <div className="flex-1 flex flex-col p-4">
              
              {/* Stats/Phase Tracker Header */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-emerald-500 uppercase font-bold tracking-widest leading-none">
                    {ad.title}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-1">
                    {ad.subtitle}
                  </span>
                </div>
                <button
                  onClick={() => { playTactileClick(); setVoiceCoach(!voiceCoach); }}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  {voiceCoach ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Active Exercise Headline */}
              <div className="mb-2">
                <h1 className="text-xl font-bold font-mono text-slate-100 tracking-tight flex items-baseline gap-1 mt-0.5 truncate uppercase">
                  {ad.name}
                </h1>
                {currentPhase === 'ACTIVE_EXERCISE' && MAIN_EXERCISES[exerciseIndex].subName && (
                  <span className="text-[10px] text-slate-400 tracking-wide font-medium italic block">
                    {MAIN_EXERCISES[exerciseIndex].subName}
                  </span>
                )}
              </div>

              {/* Core Vector Visual Simulator Card */}
              <div className="flex-1 min-h-[220px] max-h-[380px] mb-3 select-none relative">
                {currentPhase === 'ACTIVE_REST' ? (
                  /* rest display shows a preview of next workout */
                  <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
                    <span className="text-[10px] uppercase font-mono text-slate-500 tracking-widest pb-1 z-10">PROCHAIN EXERCICE</span>
                    <span className="text-md font-bold font-mono text-emerald-400 uppercase z-10 tracking-wider">
                      {MAIN_EXERCISES[exerciseIndex + 1] ? MAIN_EXERCISES[exerciseIndex + 1].name : "TERMINÉ !"}
                    </span>
                    <span className="text-xs text-slate-400 text-center max-w-[240px] mt-2.5 z-10 leading-relaxed">
                      Respirez profondément. Préparez-vous à enchaîner {MAIN_EXERCISES[exerciseIndex + 1] ? calculateRepsForLevel(MAIN_EXERCISES[exerciseIndex + 1]) : "la fin"}.
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80 z-0"></div>
                  </div>
                ) : (
                  /* Live procedural vector animation */
                  <ExerciseAnimator
                    exerciseId={
                      currentPhase === 'WARMUP' 
                        ? -1 
                        : currentPhase === 'COOLDOWN' 
                          ? -2 
                          : MAIN_EXERCISES[exerciseIndex].id
                    }
                    exerciseName={ad.name}
                    isPaused={isPaused}
                    isWarmup={currentPhase === 'WARMUP'}
                    isCooldown={currentPhase === 'COOLDOWN'}
                  />
                )}
              </div>

              {/* Target Goal / Goal Alert */}
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3 mb-3 shrink-0">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">PROTOCOLE CIBLE :</span>
                  <span className="text-xs font-bold font-mono text-white tracking-widest uppercase bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                    {ad.target}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {ad.desc}
                </p>
                {ad.tips && (
                  <div className="mt-2 text-[10px] text-amber-500 font-mono leading-tight flex items-start gap-1">
                    <span>⚠️ CONSEIL:</span> <span className="text-slate-400">{ad.tips}</span>
                  </div>
                )}
              </div>

              {/* Primary Countdown Timer Engine */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 flex items-center justify-between shrink-0 select-none">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest1">CHRONO DE PASSAGE</span>
                  <span className="text-3xl font-bold font-mono text-slate-100 tracking-tighter mt-1">
                    {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Play/Pause control */}
                  <button
                    onClick={() => { playTactileClick(); setIsPaused(!isPaused); }}
                    className="w-12 h-12 rounded-full border border-slate-700 bg-slate-950/60 text-slate-200 hover:text-emerald-400 active:scale-95 transition-all flex items-center justify-center font-mono focus:outline-none"
                  >
                    {isPaused ? <Play className="w-5.5 h-5.5 text-emerald-400 fill-current" /> : <Pause className="w-5.5 h-5.5" />}
                  </button>

                  {/* Immediate skip */}
                  <button
                    onClick={handleSkipTimer}
                    className="h-12 px-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-slate-300 hover:text-white active:scale-95 transition-all text-xs font-mono font-bold flex items-center gap-1.5 focus:outline-none"
                  >
                    PASSER <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom tactiles */}
              <div className="grid grid-cols-2 gap-3 mt-auto shrink-0 select-none">
                <button
                  onClick={handlePrevStep}
                  disabled={exerciseIndex === 0 && currentPhase === 'WARMUP'}
                  className="py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-400 hover:text-white active:scale-95 disabled:opacity-20 transition-all flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  <ChevronLeft className="w-4 h-4" /> RECULER
                </button>

                <button
                  onClick={() => { playTactileClick(); handleNextStep(); }}
                  className="py-3 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs font-mono tracking-widest uppercase hover:bg-emerald-400 active:scale-95 transition-all flex items-center justify-center gap-1 focus:outline-none"
                >
                  VALIDER <Check className="w-4 h-4 stroke-[3px]" />
                </button>
              </div>

              {/* Panic Exit button */}
              <button
                onClick={() => {
                  if (confirm("Voulez-vous abandonner l'entraînement en cours ?")) {
                    playTactileClick();
                    setCurrentPhase('SETUP');
                    setScreen('SETUP');
                  }
                }}
                className="text-center text-[10px] font-mono text-red-500 hover:text-red-400 mt-3 hover:underline tracking-widest uppercase"
              >
                ABANDONNER LA SESSION
              </button>

            </div>
          )}

          {/* WORKOUT COMPLETED / SUCCESS SCREEN */}
          {screen === 'WORKOUT' && currentPhase === 'COMPLETED' && (
            <div className="flex-1 flex flex-col p-6 items-center justify-center text-center">
              
              <div className="w-20 h-20 rounded-full bg-emerald-950/40 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 animate-bounce mb-6">
                <Award className="w-10 h-10" />
              </div>

              <div className="text-xs font-mono text-emerald-400 font-black tracking-widest uppercase mb-1">
                MISSION COMPLÉTÉE
              </div>
              
              <h1 className="text-3xl font-extrabold font-mono tracking-tighter text-white uppercase">
                FORCE ET HONNEUR !
              </h1>

              <p className="text-xs text-slate-400 mt-2 max-w-[280px]">
                Le protocole militaire du jour a été validé. Vos muscles ont stocké l'effort de ce rituel.
              </p>

              {/* Stats breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 w-full my-6 space-y-2 text-xs font-mono text-left">
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">NIVEAU</span>
                  <span className="text-white font-bold">{selectedLevel}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">PROGRAMME</span>
                  <span className="text-white font-bold">{WEEK_PLAN_SETTINGS[selectedWeekIdx].label}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">TOURS ENCHAÎNÉS</span>
                  <span className="text-white font-bold">{customRounds} tours</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-500">EXERCICES EFFECTUÉS</span>
                  <span className="text-white font-bold">{exercisesCompletedHistory || 10} exercices</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">DURÉE TOTALISÉE</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.floor(totalElapsedSeconds / 60)}m {totalElapsedSeconds % 60}s
                  </span>
                </div>
              </div>

              {/* Motivational message based on level */}
              <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-xl text-[11px] text-slate-400 leading-relaxed mb-6">
                👉 Vous avez gagné un <strong className="text-emerald-400">grade supérieur</strong> dans votre dossier militaire. Soyez régulier demain pour consolider vos acquis !
              </div>

              {/* Finish Actions */}
              <button
                onClick={() => { playTactileClick(); setScreen('SETUP'); setCurrentPhase('SETUP'); }}
                className="w-full py-3.5 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs font-mono tracking-widest uppercase hover:bg-emerald-400 active:scale-95 transition-all text-center"
              >
                ACCUEIL GENERALE
              </button>

            </div>
          )}

          {/* GRADE DOSSIER / STATS SCREEN */}
          {screen === 'STATS' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <WorkoutStats
                history={workoutHistory}
                onClearHistory={handleClearHistory}
                onClose={() => setScreen('SETUP')}
              />
            </div>
          )}

        </div>

        {/* Mock iPhone Bar */}
        <div className="hidden sm:block h-6 bg-slate-950"></div>
      </div>
    </div>
  );
}
