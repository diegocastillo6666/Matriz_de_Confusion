import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Percent,
  Divide,
  Scale,
  Sparkles,
} from 'lucide-react';
import { MatrixValues } from '../types';
import { calculateMetrics, detectAccuracyParadox } from '../utils/metrics';

interface Module3Props {
  matrix: MatrixValues;
  setMatrix: React.Dispatch<React.SetStateAction<MatrixValues>>;
  onNavigateToSectors: () => void;
}

const DEFAULT_LAB_MATRIX: MatrixValues = {
  tp: 420,
  fp: 80,
  fn: 120,
  tn: 4380,
};

export const Module3MetricLab: React.FC<Module3Props> = ({
  matrix,
  setMatrix,
  onNavigateToSectors,
}) => {
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>('accuracy');
  const [activePreset, setActivePreset] = useState<string>('default');

  const metrics = calculateMetrics(matrix);
  const paradox = detectAccuracyParadox(matrix);

  const resetValues = () => {
    setMatrix(DEFAULT_LAB_MATRIX);
    setActivePreset('default');
  };

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    if (preset === 'balanced') {
      setMatrix({ tp: 400, fp: 100, fn: 100, tn: 400 });
    } else if (preset === 'same_acc_high_prec') {
      // Model 1: Total 1,000. TP=80, FP=10, FN=140, TN=770.
      // Acc = (80+770)/1000 = 85.0%. Prec = 80/90 = 88.9%. Rec = 80/220 = 36.4%.
      setMatrix({ tp: 80, fp: 10, fn: 140, tn: 770 });
    } else if (preset === 'same_acc_high_rec') {
      // Model 2: Total 1,000. TP=200, FP=130, FN=20, TN=650.
      // Acc = (200+650)/1000 = 85.0%. Prec = 200/330 = 60.6%. Rec = 200/220 = 90.9%.
      setMatrix({ tp: 200, fp: 130, fn: 20, tn: 650 });
    } else if (preset === 'zero_division') {
      // Edge case: no positive predictions
      setMatrix({ tp: 0, fp: 0, fn: 50, tn: 950 });
    } else if (preset === 'extreme_imbalance') {
      // 99% accuracy, 0% recall
      setMatrix({ tp: 0, fp: 0, fn: 10, tn: 990 });
    }
  };

  const metricCards = [
    {
      key: 'accuracy',
      name: 'Accuracy (Exactitud)',
      data: metrics.accuracy,
      formula: 'Accuracy = (TP + TN) / (TP + TN + FP + FN)',
      color: 'slate',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      badgeColor: 'bg-slate-100 text-slate-800',
    },
    {
      key: 'precision',
      name: 'Precision (Precisión)',
      data: metrics.precision,
      formula: 'Precision = TP / (TP + FP)',
      color: 'emerald',
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-200',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      key: 'recall',
      name: 'Recall / Sensibilidad',
      data: metrics.recall,
      formula: 'Recall = TP / (TP + FN)',
      color: 'indigo',
      bg: 'bg-indigo-50/60',
      border: 'border-indigo-200',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      key: 'specificity',
      name: 'Especificidad (Specificity)',
      data: metrics.specificity,
      formula: 'Specificity = TN / (TN + FP)',
      color: 'blue',
      bg: 'bg-blue-50/60',
      border: 'border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      key: 'f1Score',
      name: 'F1-Score',
      data: metrics.f1Score,
      formula: 'F1 = 2 × (Precision × Recall) / (Precision + Recall)',
      color: 'purple',
      bg: 'bg-purple-50/60',
      border: 'border-purple-200',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      key: 'fpr',
      name: 'False Positive Rate (FPR)',
      data: metrics.fpr,
      formula: 'FPR = FP / (FP + TN) = 1 - Especificidad',
      color: 'amber',
      bg: 'bg-amber-50/60',
      border: 'border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      key: 'fnr',
      name: 'False Negative Rate (FNR)',
      data: metrics.fnr,
      formula: 'FNR = FN / (FN + TP) = 1 - Recall',
      color: 'rose',
      bg: 'bg-rose-50/60',
      border: 'border-rose-200',
      badgeColor: 'bg-rose-100 text-rose-800',
    },
  ];

  const currentMetricCard = metricCards.find((m) => m.key === selectedMetricKey) || metricCards[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sliders className="w-3.5 h-3.5" />
              Módulo 3 • Laboratorio de Métricas
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Simulador Matemático y Fórmulas
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Ajusta los deslizadores de TP, FP, FN y TN para observar el efecto exacto e instantáneo sobre cada
              métrica. Comprueba cómo cambian las interpretaciones y qué ocurre en casos límite con divisiones por cero.
            </p>
          </div>

          <button
            onClick={resetValues}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition self-start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer Valores
          </button>
        </div>

        {/* Preset Experiments Bar */}
        <div className="mt-4 pt-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Escenarios de Prueba y Paradojas Preconfiguradas:
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => applyPreset('same_acc_high_prec')}
              className={`px-3 py-1.5 rounded-xl font-bold border transition ${
                activePreset === 'same_acc_high_prec'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              ⚖️ Modelo A: 85% Accuracy (Alta Precisión, Bajo Recall)
            </button>
            <button
              onClick={() => applyPreset('same_acc_high_rec')}
              className={`px-3 py-1.5 rounded-xl font-bold border transition ${
                activePreset === 'same_acc_high_rec'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              ⚖️ Modelo B: 85% Accuracy (Baja Precisión, Alto Recall)
            </button>
            <button
              onClick={() => applyPreset('extreme_imbalance')}
              className={`px-3 py-1.5 rounded-xl font-bold border transition ${
                activePreset === 'extreme_imbalance'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
              }`}
            >
              ⚠️ Paradoja: 99% Exactitud con 0% Recall
            </button>
            <button
              onClick={() => applyPreset('zero_division')}
              className={`px-3 py-1.5 rounded-xl font-bold border transition ${
                activePreset === 'zero_division'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-rose-50 border-rose-200 text-rose-900 hover:bg-rose-100'
              }`}
            >
              ⚡ División por Cero (Sin Predicciones Positivas)
            </button>
          </div>
        </div>
      </div>

      {/* Sliders Control Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center justify-between">
          <span>Controles de Entrada (Ajusta los valores con los deslizadores):</span>
          <span className="text-xs font-mono text-slate-500 font-normal">
            Total Población: <strong>{metrics.total.toLocaleString()}</strong>
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Slider TP */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-emerald-800">TP (Verdaderos Positivos)</span>
              <span className="font-mono font-bold text-emerald-950 text-base">{matrix.tp}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="5"
              value={matrix.tp}
              onChange={(e) => setMatrix((p) => ({ ...p, tp: parseInt(e.target.value) }))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-emerald-700 font-mono">
              <span>0</span>
              <span>1,000</span>
            </div>
          </div>

          {/* Slider FP */}
          <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-amber-800">FP (Falsos Positivos)</span>
              <span className="font-mono font-bold text-amber-950 text-base">{matrix.fp}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="5"
              value={matrix.fp}
              onChange={(e) => setMatrix((p) => ({ ...p, fp: parseInt(e.target.value) }))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-amber-700 font-mono">
              <span>0</span>
              <span>1,000</span>
            </div>
          </div>

          {/* Slider FN */}
          <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-rose-800">FN (Falsos Negativos)</span>
              <span className="font-mono font-bold text-rose-950 text-base">{matrix.fn}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="5"
              value={matrix.fn}
              onChange={(e) => setMatrix((p) => ({ ...p, fn: parseInt(e.target.value) }))}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-rose-700 font-mono">
              <span>0</span>
              <span>1,000</span>
            </div>
          </div>

          {/* Slider TN */}
          <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-blue-800">TN (Verdaderos Negativos)</span>
              <span className="font-mono font-bold text-blue-950 text-base">{matrix.tn}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="25"
              value={matrix.tn}
              onChange={(e) => setMatrix((p) => ({ ...p, tn: parseInt(e.target.value) }))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-blue-700 font-mono">
              <span>0</span>
              <span>5,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 7 Metric Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-sm">
            Las 7 Métricas Oficiales de Clasificación (Haz clic para ver su desglose pedagógico):
          </h3>
          <span className="text-xs text-slate-400">Seleccionada: {currentMetricCard.name}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map((card) => {
            const isSelected = selectedMetricKey === card.key;
            const isUndefined = card.data.isUndefined;

            return (
              <div
                key={card.key}
                onClick={() => setSelectedMetricKey(card.key)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? `${card.bg} border-indigo-600 shadow-md ring-2 ring-indigo-400/40`
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700">{card.name}</span>
                  {isUndefined ? (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md text-[10px] font-bold">
                      0 / 0
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">0.0 - 1.0</span>
                  )}
                </div>

                <div className="my-2">
                  {isUndefined ? (
                    <div className="text-lg font-black text-rose-600">Indefinido</div>
                  ) : (
                    <div className="text-3xl font-black text-slate-900">{card.data.formatted}</div>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-500 bg-slate-100/80 px-2 py-1 rounded-md truncate">
                  {card.formula}
                </div>

                {isUndefined && (
                  <p className="text-[10px] text-rose-600 mt-2 font-medium">
                    ⚠️ {card.data.undefinedReason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Metric Inspector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Análisis Detallado de la Métrica
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {currentMetricCard.name}
            </h4>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700">
            Fórmula: <strong>{currentMetricCard.formula}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                ¿Qué mide esta métrica?
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {currentMetricCard.data.description}
              </p>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                ¿Qué significa que el valor AUMENTE (↑)?
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                {currentMetricCard.data.interpretationHigh}
              </p>
            </div>

            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900 mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                ¿Qué significa que el valor DISMINUYA (↓)?
              </div>
              <p className="text-xs text-rose-950 leading-relaxed">
                {currentMetricCard.data.interpretationLow}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Scale className="w-4 h-4 text-indigo-600" />
              ¿Existe una métrica "universalmente superior"?
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Rotundamente NO.</strong> En Machine Learning ninguna métrica es una varita mágica.
              La importancia relativa de cada una depende enteramente del <strong>costo de los errores</strong> en
              tu problema empresarial específico:
            </p>
            <ul className="text-xs text-slate-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Recall:</strong> Prioritario cuando el costo de omitir un positivo (FN) es mortal o
                  catastrófico (cáncer, detección de fraude, piezas de avión).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>Precision:</strong> Prioritario cuando el costo de dar una falsa alarma (FP) quema
                  presupuesto, molesta a clientes clave o acarrea sanciones legales.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>
                  <strong>F1-Score:</strong> Ideal cuando buscas un equilibrio sano entre no omitir positivos y no
                  saturar al equipo con falsas alarmas.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation to Sector Cases */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 gap-4">
        <div>
          <h4 className="font-bold text-indigo-950 text-base">
            ¿Cómo se aplican estas fórmulas en la vida real?
          </h4>
          <p className="text-xs text-indigo-800 mt-0.5">
            Explora 8 sectores económicos reales: Banca, Medicina, Telco, Retail, Manufactura, RRHH, Marketing y Seguros.
          </p>
        </div>
        <button
          onClick={onNavigateToSectors}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition shrink-0"
        >
          <span>Ir a Casos por Sector Económico</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
