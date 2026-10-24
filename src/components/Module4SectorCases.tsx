import React, { useState } from 'react';
import {
  Building2,
  Landmark,
  Stethoscope,
  Radio,
  ShoppingCart,
  Cpu,
  Users,
  TrendingUp,
  ShieldAlert,
  Download,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Info,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { SectorCase, MatrixValues } from '../types';
import { SECTOR_CASES } from '../data/sectors';
import { calculateMetrics } from '../utils/metrics';
import { generateSingleTopicHtml, downloadHtmlFile } from '../utils/htmlExporter';

interface Module4Props {
  onSectorQuizSolved: (sectorId: string, xpReward: number) => void;
  solvedSectorQuizzes: string[];
  onConsultAi: (sector: SectorCase) => void;
}

export const Module4SectorCases: React.FC<Module4Props> = ({
  onSectorQuizSolved,
  solvedSectorQuizzes,
  onConsultAi,
}) => {
  const [activeSectorId, setActiveSectorId] = useState<string>('banca');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const activeSector = SECTOR_CASES.find((s) => s.id === activeSectorId) || SECTOR_CASES[0];
  const metrics = calculateMetrics(activeSector.defaultMatrix);
  const isSolved = solvedSectorQuizzes.includes(activeSector.id);

  // Icon mapping
  const getSectorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Landmark':
        return Landmark;
      case 'Stethoscope':
        return Stethoscope;
      case 'Radio':
        return Radio;
      case 'ShoppingCart':
        return ShoppingCart;
      case 'Cpu':
        return Cpu;
      case 'Users':
        return Users;
      case 'TrendingUp':
        return TrendingUp;
      case 'ShieldAlert':
        return ShieldAlert;
      default:
        return Building2;
    }
  };

  const handleSectorChange = (id: string) => {
    setActiveSectorId(id);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setAnswerSubmitted(true);
    if (selectedAnswer === activeSector.quiz.correctIndex) {
      onSectorQuizSolved(activeSector.id, 40);
    }
  };

  const handleExportThisSector = () => {
    const html = generateSingleTopicHtml(activeSector);
    const filename = `matriz_confusion_${activeSector.id}.html`;
    downloadHtmlFile(html, filename);
    setExportNotice(`¡Descargado exitosamente como ${filename}!`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              Módulo 4 • Biblioteca Sectorial (8 Industrias)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Casos Prácticos por Sector Económico
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Cada industria enfrenta costos asimétricos distintos para los Falsos Positivos y Falsos Negativos.
              Explora cómo cambian las prioridades de clasificación y traduce métricas en recomendaciones de negocio.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start">
            <button
              onClick={handleExportThisSector}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Download className="w-4 h-4" />
              Exportar este Caso a HTML
            </button>
            <button
              onClick={() => onConsultAi(activeSector)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              Preguntar al Asistente IA
            </button>
          </div>
        </div>

        {/* Sector Tabs Carousel */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SECTOR_CASES.map((sector) => {
            const Icon = getSectorIcon(sector.icon);
            const isSelected = activeSectorId === sector.id;
            const solved = solvedSectorQuizzes.includes(sector.id);

            return (
              <button
                key={sector.id}
                onClick={() => handleSectorChange(sector.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{sector.name}</span>
                {solved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Active Sector Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
        {/* Case Title and Overview */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 font-extrabold text-[11px] rounded-full uppercase tracking-wider">
              {activeSector.sectorName}
            </span>
            <span className="text-xs text-slate-400 font-medium">Datos Ficticios con Fines Educativos</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{activeSector.name}</h3>
          <p className="text-sm font-semibold text-slate-600 mt-1">{activeSector.tagline}</p>
        </div>

        {/* Problem and Objective */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              1. Problema de Negocio
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {activeSector.businessProblem}
            </p>
          </div>

          <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl">
            <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
              2. Objetivo del Modelo
            </div>
            <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed font-medium">
              {activeSector.modelObjective}
            </p>
          </div>
        </div>

        {/* Positive Class Definition Callout */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-2xl flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-emerald-950">
            <div className="font-extrabold text-emerald-900 mb-0.5">
              Definición de la Clase Positiva en este Caso:
            </div>
            <p>
              • <strong>Clase Positiva (+):</strong> {activeSector.positiveClass} ({activeSector.positiveDefinition})
            </p>
            <p className="mt-1">
              • <strong>Clase Negativa (-):</strong> {activeSector.negativeClass} ({activeSector.negativeDefinition})
            </p>
          </div>
        </div>

        {/* Disclaimer if present (Healthcare / HR) */}
        {activeSector.disclaimer && (
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{activeSector.disclaimer}</p>
          </div>
        )}

        {/* Sector Confusion Matrix */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-extrabold text-slate-900 text-sm">
              Matriz de Confusión del Caso ({metrics.total.toLocaleString()} observaciones auditadas):
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-2.5 text-center text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="p-2.5 bg-slate-100 rounded-xl text-slate-500 font-bold text-left">
                    Realidad \\ Predicción
                  </th>
                  <th className="p-3 bg-indigo-50 text-indigo-950 font-bold rounded-xl border border-indigo-200">
                    Pred: {activeSector.positiveClass}
                  </th>
                  <th className="p-3 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200">
                    Pred: {activeSector.negativeClass}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="p-3 bg-indigo-50 text-indigo-950 font-bold text-left rounded-xl border border-indigo-200">
                    Real: {activeSector.positiveClass}
                  </th>
                  <td className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-left">
                    <div className="flex justify-between items-center text-[10px] font-extrabold text-emerald-800 uppercase">
                      <span>Verdadero Positivo (TP)</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-emerald-950 my-1">
                      {activeSector.defaultMatrix.tp.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-900 leading-snug">{activeSector.tpDescription}</div>
                    <div className="text-[10px] text-emerald-700 italic mt-1.5">
                      Ej: {activeSector.tpConcreteExample}
                    </div>
                  </td>
                  <td className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl text-left">
                    <div className="flex justify-between items-center text-[10px] font-extrabold text-rose-800 uppercase">
                      <span>Falso Negativo (FN)</span>
                      <XCircle className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="text-2xl font-black text-rose-950 my-1">
                      {activeSector.defaultMatrix.fn.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-rose-900 leading-snug">{activeSector.fnDescription}</div>
                    <div className="text-[10px] text-rose-700 italic mt-1.5">
                      Ej: {activeSector.fnConcreteExample}
                    </div>
                  </td>
                </tr>

                <tr>
                  <th className="p-3 bg-slate-50 text-slate-700 font-bold text-left rounded-xl border border-slate-200">
                    Real: {activeSector.negativeClass}
                  </th>
                  <td className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl text-left">
                    <div className="flex justify-between items-center text-[10px] font-extrabold text-amber-800 uppercase">
                      <span>Falso Positivo (FP)</span>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-2xl font-black text-amber-950 my-1">
                      {activeSector.defaultMatrix.fp.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-amber-900 leading-snug">{activeSector.fpDescription}</div>
                    <div className="text-[10px] text-amber-700 italic mt-1.5">
                      Ej: {activeSector.fpConcreteExample}
                    </div>
                  </td>
                  <td className="p-4 bg-blue-50 border-2 border-blue-400 rounded-2xl text-left">
                    <div className="flex justify-between items-center text-[10px] font-extrabold text-blue-800 uppercase">
                      <span>Verdadero Negativo (TN)</span>
                      <ShieldAlert className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-2xl font-black text-blue-950 my-1">
                      {activeSector.defaultMatrix.tn.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-blue-900 leading-snug">{activeSector.tnDescription}</div>
                    <div className="text-[10px] text-blue-700 italic mt-1.5">
                      Ej: {activeSector.tnConcreteExample}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculated Metrics Snapshot for this Sector */}
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm mb-3">
            Métricas de Rendimiento Obtenidas:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[10px] font-bold text-slate-500 uppercase">Accuracy</div>
              <div className="text-xl font-black text-slate-900">{metrics.accuracy.formatted}</div>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">Precision</div>
              <div className="text-xl font-black text-emerald-900">{metrics.precision.formatted}</div>
            </div>
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
              <div className="text-[10px] font-bold text-indigo-800 uppercase">Recall</div>
              <div className="text-xl font-black text-indigo-900">{metrics.recall.formatted}</div>
            </div>
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
              <div className="text-[10px] font-bold text-blue-800 uppercase">Especificidad</div>
              <div className="text-xl font-black text-blue-900">{metrics.specificity.formatted}</div>
            </div>
            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
              <div className="text-[10px] font-bold text-purple-800 uppercase">F1-Score</div>
              <div className="text-xl font-black text-purple-900">{metrics.f1Score.formatted}</div>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
              <div className="text-[10px] font-bold text-amber-800 uppercase">Tasa FP (FPR)</div>
              <div className="text-xl font-black text-amber-900">{metrics.fpr.formatted}</div>
            </div>
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl">
              <div className="text-[10px] font-bold text-rose-800 uppercase">Tasa FN (FNR)</div>
              <div className="text-xl font-black text-rose-900">{metrics.fnr.formatted}</div>
            </div>
          </div>
        </div>

        {/* Critical Metrics for this Business Sector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-3">
            <h4 className="font-extrabold text-indigo-950 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-700" />
              Métricas Más Críticas para este Sector:
            </h4>
            <div className="space-y-2">
              {activeSector.criticalMetrics.map((cm, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-indigo-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-indigo-950">{cm.metric}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        cm.priority === 'Crítica'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Prioridad {cm.priority}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{cm.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Recomendaciones Estratégicas de Negocio:
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {activeSector.businessRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-indigo-600">{i + 1}.</span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Interactive Case Quiz Validation */}
        <div className="p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl shadow-md">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            Comprobación de Comprensión del Caso (+40 XP)
          </div>

          <h4 className="text-base sm:text-lg font-bold mb-4">{activeSector.quiz.question}</h4>

          <div className="space-y-2.5 mb-5">
            {activeSector.quiz.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              let btnClass = 'bg-white/10 hover:bg-white/15 border-white/10 text-slate-200';

              if (answerSubmitted) {
                if (idx === activeSector.quiz.correctIndex) {
                  btnClass = 'bg-emerald-600/80 border-emerald-400 text-white font-bold ring-2 ring-emerald-400';
                } else if (isSelected) {
                  btnClass = 'bg-rose-600/80 border-rose-400 text-white line-through';
                }
              } else if (isSelected) {
                btnClass = 'bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-300 font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={answerSubmitted && selectedAnswer === activeSector.quiz.correctIndex}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {answerSubmitted && idx === activeSector.quiz.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {!answerSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Comprobar Respuesta
            </button>
          ) : (
            <div className="space-y-3">
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  selectedAnswer === activeSector.quiz.correctIndex
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/80 border-rose-500 text-rose-200'
                }`}
              >
                <div className="font-bold text-sm mb-1">
                  {selectedAnswer === activeSector.quiz.correctIndex
                    ? '🎉 ¡Excelente deducción!'
                    : '❌ No es la respuesta adecuada. Revisa la explicación:'}
                </div>
                <p>{activeSector.quiz.explanation}</p>
              </div>

              {selectedAnswer !== activeSector.quiz.correctIndex && (
                <button
                  onClick={() => {
                    setAnswerSubmitted(false);
                    setSelectedAnswer(null);
                  }}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition"
                >
                  Volver a Intentarlo
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
