import React from 'react';
import {
  X,
  Award,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  Trophy,
  Flame,
} from 'lucide-react';
import { GamificationState } from '../types';

interface GamificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  gamification: GamificationState;
}

export const GamificationDrawer: React.FC<GamificationDrawerProps> = ({
  isOpen,
  onClose,
  gamification,
}) => {
  if (!isOpen) return null;

  const unlockedCount = gamification.badges.filter((b) => b.unlocked).length;
  const progressPercent = Math.round((unlockedCount / gamification.badges.length) * 100);

  // Calculate XP threshold to next level
  let nextLevelXp = 200;
  let currentLevelBase = 0;
  if (gamification.level === 'Intermedio') {
    currentLevelBase = 200;
    nextLevelXp = 500;
  } else if (gamification.level === 'Avanzado') {
    currentLevelBase = 500;
    nextLevelXp = 1000;
  }

  const levelProgress = Math.min(
    100,
    Math.round(((gamification.xp - currentLevelBase) / (nextLevelXp - currentLevelBase)) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Tu Perfil de Aprendizaje</h3>
              <p className="text-xs text-indigo-200">Progreso, puntos de experiencia e insignias</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-indigo-200 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* XP & Level Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
                  <Zap className="w-5 h-5 fill-white" />
                </span>
                <div>
                  <div className="text-xs text-amber-800 font-semibold uppercase tracking-wider">Nivel Actual</div>
                  <div className="text-xl font-extrabold text-amber-950">{gamification.level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-amber-900">{gamification.xp} <span className="text-sm font-bold text-amber-700">XP</span></div>
                <div className="text-[11px] text-amber-700 font-medium">Siguiente rango a los {nextLevelXp} XP</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-amber-200/60 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, levelProgress)}%` }}
              />
            </div>
          </div>

          {/* Badges Collection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                Insignias Obtenidas ({unlockedCount} de {gamification.badges.length})
              </h4>
              <span className="text-xs font-semibold text-slate-500">{progressPercent}% completado</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gamification.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                    badge.unlocked
                      ? 'bg-emerald-50/60 border-emerald-200'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      badge.unlocked
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {badge.unlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {badge.title}
                      {badge.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">{badge.description}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Requisito: {badge.requirement}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Resuelve quizzes y casos prácticos para ganar XP</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
