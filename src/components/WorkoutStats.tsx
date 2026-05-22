import React, { useEffect, useState } from 'react';
import { WorkoutHistoryEntry } from '../types';
import { Award, Calendar, Clock, RotateCcw, Shield, Trash2, Trophy } from 'lucide-react';
import { playTactileClick } from '../utils/audio';

interface WorkoutStatsProps {
  history: WorkoutHistoryEntry[];
  onClearHistory: () => void;
  onClose: () => void;
}

export const WorkoutStats: React.FC<WorkoutStatsProps> = ({
  history,
  onClearHistory,
  onClose
}) => {
  const [cumulativeSeconds, setCumulativeSeconds] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const totalSecs = history.reduce((sum, item) => sum + item.totalDurationSeconds, 0);
    setCumulativeSeconds(totalSecs);
    setCompletedSessions(history.length);
    
    // Simple streak calculator
    if (history.length === 0) {
      setStreak(0);
      return;
    }
    
    // Sort history by date descending
    const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Clean unique day list
    const days = sorted.map(item => item.date.split('T')[0]);
    const uniqueDays = Array.from(new Set(days));
    
    if (uniqueDays.length === 0) {
      setStreak(0);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If latest workout is older than yesterday, streak is broken
    const latestDay = uniqueDays[0];
    if (latestDay !== todayStr && latestDay !== yesterdayStr) {
      setStreak(0);
      return;
    }

    let continuousStreak = 1;
    for (let i = 0; i < uniqueDays.length - 1; i++) {
      const current = new Date(uniqueDays[i]);
      const next = new Date(uniqueDays[i + 1]);
      const diffTime = Math.abs(current.getTime() - next.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        continuousStreak++;
      } else if (diffDays > 1) {
        break; // Streak broken
      }
    }
    setStreak(continuousStreak);
  }, [history]);

  // Determine military rank based on cumulative workouts
  const getMilitaryRank = (sessions: number) => {
    if (sessions >= 20) return { title: "GÉNERAL DE BRIGADE", icon: "🎖️🎖️🎖️", desc: "Le sommet absolu. Force, discipline et endurance inégalées.", color: "text-red-400" };
    if (sessions >= 10) return { title: "COMMANDO D'ÉLITE", icon: "🎖️🎖️", desc: "Machine de combat indestructible. Le respect vous est acquis.", color: "text-amber-400" };
    if (sessions >= 5) return { title: "SERGENT-CHEF", icon: "🎖️", desc: "Leader exemplaire. Vos muscles se sont adaptés au protocole.", color: "text-emerald-400" };
    if (sessions >= 2) return { title: "CAPORAL", icon: "▪️▪️", desc: "Solide combattant. Vous refusez d'abandonner.", color: "text-blue-400" };
    return { title: "RECRUE DE BASE", icon: "▪️", desc: "La formation de base a commencé. Reste discipliné !", color: "text-slate-400" };
  };

  const rank = getMilitaryRank(completedSessions);

  return (
    <div className="w-full flex flex-col h-full bg-slate-950 text-slate-100 p-4 font-sans select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold font-mono tracking-widest text-emerald-400">DOSSIER MILITAIRE</h2>
        </div>
        <button 
          onClick={() => { playTactileClick(); onClose(); }}
          className="px-2.5 py-1 text-xs font-mono bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 active:scale-95 transition-all text-slate-400"
        >
          RETOUR
        </button>
      </div>

      {/* Military Badge / Rank */}
      <div className="w-full bg-gradient-to-br from-slate-900 to-emerald-950/20 rounded-2xl p-4 border border-emerald-900/30 mb-4 flex gap-4 items-center">
        <div className="w-14 h-14 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-inner">
          {completedSessions >= 10 ? "🔱" : "🎖️"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase font-mono text-emerald-400/70 tracking-widest">GRADE MILITAIRE</div>
          <div className={`text-md font-extrabold font-mono tracking-wide ${rank.color} truncate`}>
            {rank.title} {rank.icon}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{rank.desc}</div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <Trophy className="w-4 h-4 text-amber-500 mb-1" />
          <div>
            <div className="text-lg font-bold font-mono text-slate-100">{completedSessions}</div>
            <div className="text-[9px] uppercase font-mono text-slate-500 tracking-wider">Missions</div>
          </div>
        </div>

        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <Clock className="w-4 h-4 text-emerald-400 mb-1" />
          <div>
            <div className="text-lg font-bold font-mono text-slate-100">
              {Math.floor(cumulativeSeconds / 60)}m<span className="text-xs font-normal text-slate-400">{cumulativeSeconds % 60}s</span>
            </div>
            <div className="text-[9px] uppercase font-mono text-slate-500 tracking-wider">Durée Totale</div>
          </div>
        </div>

        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <Award className="w-4 h-4 text-red-400 mb-1" />
          <div>
            <div className="text-lg font-bold font-mono text-slate-100">{streak} 🔥</div>
            <div className="text-[9px] uppercase font-mono text-slate-500 tracking-wider">Série Jrs</div>
          </div>
        </div>
      </div>

      {/* Mission History Logs */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2 px-1">
          <span>HISTORIQUE DES ENTRAÎNEMENTS</span>
          <span>{history.length} ENREGISTRÉ(S)</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[200px]">
          {history.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              Aucun entraînement pour le moment.<br />Votre discipline commence aujourd'hui !
            </div>
          ) : (
            history.map((entry) => {
              const formattedDate = new Date(entry.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              });
              
              return (
                <div key={entry.id} className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-200 uppercase tracking-wide truncate">
                      {entry.weekRange} • {entry.level}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                      <Calendar className="w-3 h-3 text-slate-600 inline" />
                      {formattedDate}
                    </div>
                  </div>
                  <div className="text-right flex flex-col shrink-0 font-mono">
                    <span className="text-emerald-400 font-bold">{entry.roundsCount} tours</span>
                    <span className="text-[10px] text-slate-400">
                      {Math.floor(entry.totalDurationSeconds / 60)}m {entry.totalDurationSeconds % 60}s
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Clear/Reset button */}
      {history.length > 0 && (
        <button
          onClick={() => {
            if (confirm("Voulez-vous réinitialiser tout votre dossier historique militaire ?")) {
              playTactileClick();
              onClearHistory();
            }
          }}
          className="w-full mt-4 py-2 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-xs font-mono hover:bg-red-950/40 active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> EFFACER TOUTES LES DONNÉES
        </button>
      )}
    </div>
  );
};
