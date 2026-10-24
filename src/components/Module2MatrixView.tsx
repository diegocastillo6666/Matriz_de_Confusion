import React, { useState } from 'react';
import {
  Grid,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Percent,
  Hash,
  RotateCcw,
  Info,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { MatrixValues } from '../types';
import { calculateMetrics, getNormalizedMatrix, detectAccuracyParadox } from '../utils/metrics';

interface Module2Props {
  matrix: MatrixValues;
  setMatrix: React.Dispatch<React.SetStateAction<MatrixValues>>;
  onNavigateToLab: () => void;
  onCellClickAction?: () => void;
}

type CellType = 'tp' | 'fp' | 'fn' | 'tn';

export const Module2MatrixView: React.FC<Module2Props> = ({
  matrix,
  setMatrix,
  onNavigateToLab,
  onCellClickAction,
}) => {
  const [selectedCell, setSelectedCell] = useState<CellType>('tp');
  const [displayMode, setDisplayMode] = useState<'absolute' | 'normalized_total' | 'normalized_actual'>('absolute');
  const [positiveClassName, setPositiveClassName] = useState<string>('Positivo (Evento de Interés)');
  const [negativeClassName, setNegativeClassName] = useState<string>('Negativo (Normal)');

  const metrics = calculateMetrics(matrix);
  const normalizedTotal = getNormalizedMatrix(matrix, 'total');
  const normalizedActual = getNormalizedMatrix(matrix, 'actual');
  const paradox = detectAccuracyParadox(matrix);

  // Update cell handler with safety
  const updateValue = (cell: CellType, delta: number) => {
    setMatrix((prev) => ({
      ...prev,
      [cell]: Math.max(0, prev[cell] + delta),
    }));
  };

  const handleCellClick = (cell: CellType) => {
    setSelectedCell(cell);
    if (onCellClickAction) onCellClickAction();
  };

  const cellDetails = {
    tp: {
      title: 'Verdadero Positivo (TP - True Positive)',
      badge: 'Acierto en Clase Positiva',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      color: 'emerald',
      realClass: positiveClassName,
      predictedClass: positiveClassName,
      isCorrect: true,
      definition:
        'La realidad era positiva y el modelo predijo correctamente que era positiva. El evento fue detectado con éxito.',
      concreteExamples: [
        'Transacción fraudulenta detectada y bloqueada a tiempo.',
        'Paciente con tumor maligno detectado para tratamiento temprano.',
        'Pieza defectuosa separada de la línea de ensamblaje.',
      ],
      impact:
        'Aumentar el TP mejora directamente tanto la Precisión (Precision) como la Sensibilidad (Recall) y el F1-Score.',
    },
    fp: {
      title: 'Falso Positivo (FP - False Positive | Error Tipo I)',
      badge: 'Falsa Alarma (Error Tipo I)',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      color: 'amber',
      realClass: negativeClassName,
      predictedClass: positiveClassName,
      isCorrect: false,
      definition:
        'La realidad era negativa, pero el modelo predijo que era positiva. El modelo disparó una alarma innecesaria.',
      concreteExamples: [
        'Cliente habitual cuya tarjeta es bloqueada por error en vacaciones.',
        'Paciente sano sometido a biopsia invasiva innecesaria.',
        'Correo de trabajo importante enviado a la carpeta de Spam.',
      ],
      impact:
        'Aumentar los FP degrada severamente la Precisión (Precision = TP / (TP + FP)) y aumenta la tasa de falsos positivos (FPR).',
    },
    fn: {
      title: 'Falso Negativo (FN - False Negative | Error Tipo II)',
      badge: 'Omisión Peligrosa (Error Tipo II)',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      color: 'rose',
      realClass: positiveClassName,
      predictedClass: negativeClassName,
      isCorrect: false,
      definition:
        'La realidad era positiva, pero el modelo predijo que era negativa. El modelo no vio el evento y lo dejó escapar.',
      concreteExamples: [
        'Fraude de 5,000 USD aprobado sin revisión; pérdida financiera.',
        'Paciente enfermo enviado a casa sin tratamiento que empeora.',
        'Pieza defectuosa montada en un avión con riesgo de accidente.',
      ],
      impact:
        'Aumentar los FN destruye el Recall / Sensibilidad (Recall = TP / (TP + FN)). En salud y seguridad, este es el error más crítico.',
    },
    tn: {
      title: 'Verdadero Negativo (TN - True Negative)',
      badge: 'Descarte Correcto',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      color: 'blue',
      realClass: negativeClassName,
      predictedClass: negativeClassName,
      isCorrect: true,
      definition:
        'La realidad era negativa y el modelo predijo correctamente que era negativa. El caso normal fue aprobado o descartado sin fricción.',
      concreteExamples: [
        'Transacción normal aprobada en 1 segundo en el supermercado.',
        'Paciente sano diagnosticado como sano tras su chequeo anual.',
        'Pieza conforme que avanza al siguiente paso de producción.',
      ],
      impact:
        'Aumentar los TN eleva la Especificidad (Specificity = TN / (TN + FP)) y reduce el FPR.',
    },
  };

  const activeDetail = cellDetails[selectedCell];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Grid className="w-3.5 h-3.5" />
              Módulo 2 • Matriz de Confusión Interactiva
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Explora la Cuadrícula 2×2 en Tiempo Real
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Haz clic en cualquier celda para inspeccionarla en detalle. Modifica los valores con los controles
              o botones de ajuste rápido para ver cómo reaccionan las métricas al instante.
            </p>
          </div>

          {/* Display Mode Toggles */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl self-start">
            <button
              onClick={() => setDisplayMode('absolute')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                displayMode === 'absolute' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              Valores Absolutos
            </button>
            <button
              onClick={() => setDisplayMode('normalized_total')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                displayMode === 'normalized_total' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              % del Total
            </button>
            <button
              onClick={() => setDisplayMode('normalized_actual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                displayMode === 'normalized_actual' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              % por Fila Real
            </button>
          </div>
        </div>

        {/* Relatividad de la Clase Positiva Banner */}
        <div className="mt-4 p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-start gap-3 text-xs text-indigo-950">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-indigo-900">Nota conceptual fundamental: </strong>
            Las métricas como Precision, Recall y F1 dependen estrictamente de cuál clase se defina como
            <strong> "Positiva"</strong>. Positivo no significa bueno ni deseable, sino la condición o anomalía
            que se desea detectar (ej: Fraude, Enfermedad, Fuga o Defecto).
          </div>
        </div>
      </div>

      {/* Paradox Warning if active */}
      {paradox.hasParadox && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3 text-amber-950 text-xs sm:text-sm animate-pulse">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-900 mb-0.5">Comportamiento Asimétrico Detectado</div>
            <p>{paradox.explanation}</p>
          </div>
        </div>
      )}

      {/* Interactive 2x2 Matrix & Cell Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Matrix 2x2 Canvas */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Grid className="w-4 h-4 text-indigo-600" />
              Estructura de la Matriz 2×2
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Total: <strong>{metrics.total.toLocaleString()}</strong> casos
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-3 text-center">
              <thead>
                <tr>
                  <th className="p-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-left w-28">
                    Realidad \\ Predicción
                  </th>
                  <th className="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 border border-slate-200">
                    <div className="text-[10px] text-indigo-600 uppercase font-bold">Predicción Positiva</div>
                    <div className="text-slate-900 font-extrabold">{positiveClassName}</div>
                  </th>
                  <th className="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Predicción Negativa</div>
                    <div className="text-slate-900 font-extrabold">{negativeClassName}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Fila 1: Realidad Positiva */}
                <tr>
                  <th className="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 text-left border border-slate-200">
                    <div className="text-[10px] text-indigo-600 uppercase font-bold">Clase Real Positiva</div>
                    <div className="text-slate-900 font-extrabold">{positiveClassName}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Total: {metrics.actualPositive}
                    </div>
                  </th>

                  {/* TP Cell */}
                  <td
                    onClick={() => handleCellClick('tp')}
                    className={`p-4 rounded-2xl cursor-pointer transition-all transform hover:-translate-y-0.5 relative ${
                      selectedCell === 'tp'
                        ? 'bg-emerald-100/90 border-2 border-emerald-600 shadow-md ring-2 ring-emerald-400/40'
                        : 'bg-emerald-50/70 border-2 border-emerald-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-800 uppercase tracking-wide">
                      <span>Verdadero Positivo</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-3xl font-black text-emerald-950 my-1">
                      {displayMode === 'absolute'
                        ? matrix.tp.toLocaleString()
                        : displayMode === 'normalized_total'
                        ? normalizedTotal.tp
                        : normalizedActual.tp}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium">TP (Acierto Positivo)</div>
                    {/* Stepper controls */}
                    <div
                      className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-emerald-200/60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => updateValue('tp', -10)}
                        className="px-2 py-0.5 text-xs font-bold bg-white text-emerald-800 rounded-md shadow-2xs hover:bg-emerald-50 border border-emerald-200"
                        title="-10"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => updateValue('tp', 10)}
                        className="px-2 py-0.5 text-xs font-bold bg-white text-emerald-800 rounded-md shadow-2xs hover:bg-emerald-50 border border-emerald-200"
                        title="+10"
                      >
                        +10
                      </button>
                    </div>
                  </td>

                  {/* FN Cell */}
                  <td
                    onClick={() => handleCellClick('fn')}
                    className={`p-4 rounded-2xl cursor-pointer transition-all transform hover:-translate-y-0.5 relative ${
                      selectedCell === 'fn'
                        ? 'bg-rose-100/90 border-2 border-rose-600 shadow-md ring-2 ring-rose-400/40'
                        : 'bg-rose-50/70 border-2 border-rose-200 hover:border-rose-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-rose-800 uppercase tracking-wide">
                      <span>Falso Negativo</span>
                      <XCircle className="w-4 h-4 text-rose-600" />
                    </div>
                    <div className="text-3xl font-black text-rose-950 my-1">
                      {displayMode === 'absolute'
                        ? matrix.fn.toLocaleString()
                        : displayMode === 'normalized_total'
                        ? normalizedTotal.fn
                        : normalizedActual.fn}
                    </div>
                    <div className="text-[11px] text-rose-700 font-medium">FN (Error Tipo II - Omisión)</div>
                    {/* Stepper controls */}
                    <div
                      className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-rose-200/60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => updateValue('fn', -10)}
                        className="px-2 py-0.5 text-xs font-bold bg-white text-rose-800 rounded-md shadow-2xs hover:bg-rose-50 border border-rose-200"
                        title="-10"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => updateValue('fn', 10)}
                        className="px-2 py-0.5 text-xs font-bold bg-white text-rose-800 rounded-md shadow-2xs hover:bg-rose-50 border border-rose-200"
                        title="+10"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Fila 2: Realidad Negativa */}
                <tr>
                  <th className="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700 text-left border border-slate-200">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Clase Real Negativa</div>
                    <div className="text-slate-900 font-extrabold">{negativeClassName}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Total: {metrics.actualNegative}
                    </div>
                  </th>

                  {/* FP Cell */}
                  <td
                    onClick={() => handleCellClick('fp')}
                    className={`p-4 rounded-2xl cursor-pointer transition-all transform hover:-translate-y-0.5 relative ${
                      selectedCell === 'fp'
                        ? 'bg-amber-100/90 border-2 border-amber-600 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-amber-50/70 border-2 border-amber-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-800 uppercase tracking-wide">
                      <span>Falso Positivo</span>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-3xl font-black text-amber-950 my-1">
                      {displayMode === 'absolute'
                        ? matrix.fp.toLocaleString()
                        : displayMode === 'normalized_total'
                        ? normalizedTotal.fp
                        : normalizedActual.fp}
                    </div>
                    <div className="text-[11px] text-amber-700 font-medium">FP (Error Tipo I - Alarma)</div>
                    {/* Stepper controls */}
                    <div
                      className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-amber-200/60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => updateValue('fp', -10)}
                        className="px-2 py-0.5 text-xs font-bold bg-white text-amber-800 rounded-md shadow-2xs hover:bg-amber-50 border border-amber-200"
                        title="-10"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => updateValue('fp', 10)}
                        className="px-2 py-0.5 text-xs font-bold bg-white text-amber-800 rounded-md shadow-2xs hover:bg-amber-50 border border-amber-200"
                        title="+10"
                      >
                        +10
                      </button>
                    </div>
                  </td>

                  {/* TN Cell */}
                  <td
                    onClick={() => handleCellClick('tn')}
                    className={`p-4 rounded-2xl cursor-pointer transition-all transform hover:-translate-y-0.5 relative ${
                      selectedCell === 'tn'
                        ? 'bg-blue-100/90 border-2 border-blue-600 shadow-md ring-2 ring-blue-400/40'
                        : 'bg-blue-50/70 border-2 border-blue-200 hover:border-blue-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-blue-800 uppercase tracking-wide">
                      <span>Verdadero Negativo</span>
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-3xl font-black text-blue-950 my-1">
                      {displayMode === 'absolute'
                        ? matrix.tn.toLocaleString()
                        : displayMode === 'normalized_total'
                        ? normalizedTotal.tn
                        : normalizedActual.tn}
                    </div>
                    <div className="text-[11px] text-blue-700 font-medium">TN (Acierto Negativo)</div>
                    {/* Stepper controls */}
                    <div
                      className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-blue-200/60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => updateValue('tn', -10)}
                        className="px-2 py-0.5 text-xs font-bold bg-white text-blue-800 rounded-md shadow-2xs hover:bg-blue-50 border border-blue-200"
                        title="-10"
                      >
                        -10
                      </button>
                      <button
                        onClick={() => updateValue('tn', 10)}
                        className="px-2 py-0.5 text-xs font-bold bg-white text-blue-800 rounded-md shadow-2xs hover:bg-blue-50 border border-blue-200"
                        title="+10"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Ajustes rápidos:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setMatrix({ tp: 350, fp: 100, fn: 50, tn: 4500 })}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
              >
                Típico (Equilibrado)
              </button>
              <button
                onClick={() => setMatrix({ tp: 10, fp: 5, fn: 90, tn: 9895 })}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-lg border border-amber-200 transition"
              >
                Muchos FN (Alta Omisión)
              </button>
              <button
                onClick={() => setMatrix({ tp: 95, fp: 450, fn: 5, tn: 9450 })}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold rounded-lg border border-indigo-200 transition"
              >
                Muchos FP (Falsa Alarma)
              </button>
            </div>
          </div>
        </div>

        {/* Selected Cell Inspector */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${activeDetail.badgeClass}`}>
              {activeDetail.badge}
            </span>
            <span className="text-xs font-bold text-slate-400">Inspector de Celda</span>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-black text-slate-900">{activeDetail.title}</h4>
            <div className="mt-2 text-xs font-semibold text-slate-500 flex items-center gap-3">
              <span>Realidad: <strong className="text-slate-800">{activeDetail.realClass}</strong></span>
              <span>•</span>
              <span>Predicho: <strong className="text-slate-800">{activeDetail.predictedClass}</strong></span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            {activeDetail.definition}
          </p>

          <div>
            <div className="text-xs font-bold text-slate-900 mb-2">Ejemplos concretos en la vida real:</div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {activeDetail.concreteExamples.map((ex, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-950">
            <strong className="font-bold text-indigo-900">Impacto en Métricas: </strong>
            {activeDetail.impact}
          </div>

          {/* Quick value input inside inspector */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Editar valor directo de {selectedCell.toUpperCase()}:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={matrix[selectedCell]}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value) || 0);
                  setMatrix((prev) => ({ ...prev, [selectedCell]: val }));
                }}
                className="w-full px-3 py-2 text-sm font-bold border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <button
                onClick={() => updateValue(selectedCell, 50)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-xl shrink-0 transition"
              >
                +50
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Snapshot of Key Metrics Calculated Automatically */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Métricas Calculadas en Tiempo Real para esta Matriz
          </h4>
          <button
            onClick={onNavigateToLab}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>Ver Laboratorio Completo de Fórmulas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Accuracy</div>
            <div className="text-lg sm:text-xl font-black text-slate-900">{metrics.accuracy.formatted}</div>
            <div className="text-[10px] text-slate-400 truncate">(TP+TN)/Total</div>
          </div>
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <div className="text-[10px] font-bold text-emerald-800 uppercase">Precision</div>
            <div className="text-lg sm:text-xl font-black text-emerald-900">{metrics.precision.formatted}</div>
            <div className="text-[10px] text-emerald-600 truncate">TP / (TP+FP)</div>
          </div>
          <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
            <div className="text-[10px] font-bold text-indigo-800 uppercase">Recall</div>
            <div className="text-lg sm:text-xl font-black text-indigo-900">{metrics.recall.formatted}</div>
            <div className="text-[10px] text-indigo-600 truncate">TP / (TP+FN)</div>
          </div>
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
            <div className="text-[10px] font-bold text-blue-800 uppercase">Especificidad</div>
            <div className="text-lg sm:text-xl font-black text-blue-900">{metrics.specificity.formatted}</div>
            <div className="text-[10px] text-blue-600 truncate">TN / (TN+FP)</div>
          </div>
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
            <div className="text-[10px] font-bold text-purple-800 uppercase">F1-Score</div>
            <div className="text-lg sm:text-xl font-black text-purple-900">{metrics.f1Score.formatted}</div>
            <div className="text-[10px] text-purple-600 truncate">Media Armónica</div>
          </div>
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
            <div className="text-[10px] font-bold text-amber-800 uppercase">Tasa FP (FPR)</div>
            <div className="text-lg sm:text-xl font-black text-amber-900">{metrics.fpr.formatted}</div>
            <div className="text-[10px] text-amber-600 truncate">FP / (FP+TN)</div>
          </div>
          <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl">
            <div className="text-[10px] font-bold text-rose-800 uppercase">Tasa FN (FNR)</div>
            <div className="text-lg sm:text-xl font-black text-rose-900">{metrics.fnr.formatted}</div>
            <div className="text-[10px] text-rose-600 truncate">FN / (FN+TP)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
