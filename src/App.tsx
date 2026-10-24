/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ExportModal } from './components/ExportModal';
import { GamificationDrawer } from './components/GamificationDrawer';
import { Module1Fundamentals } from './components/Module1Fundamentals';
import { Module2MatrixView } from './components/Module2MatrixView';
import { Module3MetricLab } from './components/Module3MetricLab';
import { Module4SectorCases } from './components/Module4SectorCases';
import { Module5Gamification } from './components/Module5Gamification';
import { Module6ModelComparison } from './components/Module6ModelComparison';
import { Module7AiTutor } from './components/Module7AiTutor';
import { MatrixValues, GamificationState, SectorCase } from './types';
import { SECTOR_CASES } from './data/sectors';
import { INITIAL_BADGES } from './data/quizzes';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Award, CheckCircle2 } from 'lucide-react';

const INITIAL_MATRIX: MatrixValues = {
  tp: 380,
  fp: 120,
  fn: 20,
  tn: 9480,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('fundamentos');
  const [currentMatrix, setCurrentMatrix] = useState<MatrixValues>(INITIAL_MATRIX);
  const [activeSector, setActiveSector] = useState<SectorCase>(SECTOR_CASES[0]);

  // Modal states
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState<boolean>(false);

  // Toast notification for XP / Badges
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  // Gamification state with localStorage persistence
  const [gamification, setGamification] = useState<GamificationState>(() => {
    try {
      const saved = localStorage.getItem('confusion_lab_gamification_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load gamification state from localStorage', e);
    }

    return {
      xp: 0,
      level: 'Principiante',
      completedModules: [],
      solvedSectorQuizzes: [],
      solvedChallenges: [],
      badges: INITIAL_BADGES,
      finalExamScore: null,
      finalExamCompleted: false,
      streak: 1,
    };
  });

  // Save gamification changes
  useEffect(() => {
    try {
      localStorage.setItem('confusion_lab_gamification_v1', JSON.stringify(gamification));
    } catch (e) {
      console.warn('Could not save gamification to localStorage', e);
    }
  }, [gamification]);

  // Notification helper
  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Add XP and recalculate level
  const addXp = (amount: number, reason: string) => {
    setGamification((prev) => {
      const newXp = prev.xp + amount;
      let newLevel: 'Principiante' | 'Intermedio' | 'Avanzado' = 'Principiante';

      if (newXp >= 500) {
        newLevel = 'Avanzado';
      } else if (newXp >= 200) {
        newLevel = 'Intermedio';
      }

      showToast(`+${amount} XP Obtenidos`, reason);

      if (newLevel !== prev.level) {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          showToast('¡Subiste de Nivel!', `Ahora eres rango ${newLevel}`);
        }, 1200);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
  };

  // Unlock badge helper
  const unlockBadge = (badgeId: string) => {
    setGamification((prev) => {
      const badge = prev.badges.find((b) => b.id === badgeId);
      if (!badge || badge.unlocked) return prev;

      const updatedBadges = prev.badges.map((b) => (b.id === badgeId ? { ...b, unlocked: true } : b));

      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      showToast('🏆 ¡Nueva Insignia Desbloqueada!', badge.title);

      return {
        ...prev,
        badges: updatedBadges,
      };
    });
  };

  // Handlers for modules
  const handleFundamentalsCompleted = () => {
    unlockBadge('primer-paso');
    addXp(30, 'Fundamentos teóricos completados');
  };

  const handleCellClickAction = () => {
    unlockBadge('explorador-matriz');
  };

  const handleSectorQuizSolved = (sectorId: string, xpReward: number) => {
    if (!gamification.solvedSectorQuizzes.includes(sectorId)) {
      setGamification((prev) => ({
        ...prev,
        solvedSectorQuizzes: [...prev.solvedSectorQuizzes, sectorId],
      }));
      addXp(xpReward, `Quiz del sector ${sectorId.toUpperCase()} completado`);

      if (sectorId === 'banca') unlockBadge('cazador-fraude');
      if (sectorId === 'salud') unlockBadge('guardian-salud');
    }
  };

  const handleComparisonCompleted = () => {
    unlockBadge('estratega-negocio');
    addXp(30, 'Comparación de modelos analizada');
  };

  const handleFinalExamCompleted = (score: number) => {
    setGamification((prev) => ({
      ...prev,
      finalExamScore: score,
      finalExamCompleted: true,
    }));

    if (score >= 8) {
      unlockBadge('graduado-honores');
    }
  };

  const handleConsultAiFromSector = (sector: SectorCase) => {
    setActiveSector(sector);
    setCurrentMatrix(sector.defaultMatrix);
    setActiveTab('asistente');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">{toastMessage.title}</div>
            <div className="text-xs text-slate-200 mt-0.5">{toastMessage.desc}</div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        gamification={gamification}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'fundamentos' && (
          <Module1Fundamentals
            onCompleteModule={handleFundamentalsCompleted}
            onNavigateToMatrix={() => setActiveTab('matriz')}
          />
        )}

        {activeTab === 'matriz' && (
          <Module2MatrixView
            matrix={currentMatrix}
            setMatrix={setCurrentMatrix}
            onNavigateToLab={() => {
              unlockBadge('laboratorista-metrica');
              setActiveTab('laboratorio');
            }}
            onCellClickAction={handleCellClickAction}
          />
        )}

        {activeTab === 'laboratorio' && (
          <Module3MetricLab
            matrix={currentMatrix}
            setMatrix={setCurrentMatrix}
            onNavigateToSectors={() => setActiveTab('sectores')}
          />
        )}

        {activeTab === 'sectores' && (
          <Module4SectorCases
            onSectorQuizSolved={handleSectorQuizSolved}
            solvedSectorQuizzes={gamification.solvedSectorQuizzes}
            onConsultAi={handleConsultAiFromSector}
          />
        )}

        {activeTab === 'comparacion' && (
          <Module6ModelComparison onComparisonCompleted={handleComparisonCompleted} />
        )}

        {activeTab === 'desafios' && (
          <Module5Gamification
            xp={gamification.xp}
            level={gamification.level}
            onAddXp={addXp}
            onFinalExamCompleted={handleFinalExamCompleted}
            finalExamScore={gamification.finalExamScore}
          />
        )}

        {activeTab === 'asistente' && (
          <Module7AiTutor currentSector={activeSector} currentMatrix={currentMatrix} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px]">
              ML
            </span>
            <span>ConfusionLab • Plataforma Educativa de Machine Learning</span>
          </div>
          <div>
            Aprende a interpretar modelos de clasificación con rigor matemático y perspectiva empresarial.
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        activeSector={activeSector}
        currentMatrix={currentMatrix}
        onExportSuccess={(reward) => addXp(reward, 'Contenido exportado a HTML')}
      />

      {/* Badges Drawer Modal */}
      <GamificationDrawer
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        gamification={gamification}
      />
    </div>
  );
}
