import React from 'react';
import {
  Brain,
  Download,
  Trophy,
  Zap,
  BookOpen,
  Grid,
  Sliders,
  Building2,
  GitCompare,
  Award,
  Sparkles,
} from 'lucide-react';
import { GamificationState } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  gamification: GamificationState;
  onOpenExportModal: () => void;
  onOpenBadgesModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  gamification,
  onOpenExportModal,
  onOpenBadgesModal,
}) => {
  const tabs = [
    { id: 'fundamentos', label: '1. Fundamentos', icon: BookOpen },
    { id: 'matriz', label: '2. Matriz Interactiva', icon: Grid },
    { id: 'laboratorio', label: '3. Laboratorio de Métricas', icon: Sliders },
    { id: 'sectores', label: '4. Casos por Sector (8)', icon: Building2 },
    { id: 'comparacion', label: '5. Comparador de Modelos', icon: GitCompare },
    { id: 'desafios', label: '6. Retos & Examen Final', icon: Trophy },
    { id: 'asistente', label: '7. Tutor IA Gemini', icon: Sparkles },
  ];

  const unlockedBadgesCount = gamification.badges.filter((b) => b.unlocked).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('fundamentos')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">ConfusionLab</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full uppercase tracking-wider">
                  ML Master
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Aprende la Matriz de Confusión en Ciencia de Datos</p>
            </div>
          </div>

          {/* Gamification Stats & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* XP & Level Badge */}
            <div
              onClick={onOpenBadgesModal}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-3 py-1.5 rounded-xl cursor-pointer hover:shadow-xs transition"
              title="Haz clic para ver tus insignias y progreso"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
              <div className="text-left">
                <div className="text-xs font-bold text-amber-900 leading-none">
                  {gamification.xp} <span className="font-medium text-[10px]">XP</span>
                </div>
                <div className="text-[10px] text-amber-700 font-semibold">{gamification.level}</div>
              </div>
            </div>

            {/* Badges Counter */}
            <button
              onClick={onOpenBadgesModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition"
            >
              <Award className="w-4 h-4 text-indigo-600" />
              <span>
                Insignias <strong className="text-slate-900 font-bold">{unlockedBadgesCount}/{gamification.badges.length}</strong>
              </span>
            </button>

            {/* Export Button (Prominent Action Required by Prompt) */}
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl shadow-sm shadow-indigo-300 hover:shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xs:inline">Exportar explicación a HTML</span>
              <span className="xs:hidden">Exportar HTML</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
