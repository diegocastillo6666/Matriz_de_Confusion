import React, { useState } from 'react';
import {
  GitCompare,
  TrendingUp,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Info,
  Sparkles,
} from 'lucide-react';
import { MatrixValues } from '../types';
import { calculateMetrics } from '../utils/metrics';

interface Module6Props {
  onComparisonCompleted?: () => void;
}

export const Module6ModelComparison: React.FC<Module6Props> = ({ onComparisonCompleted }) => {
  // Model A default: High recall / sensible
  const [modelA, setModelA] = useState<MatrixValues>({
    tp: 380,
    fp: 180,
    fn: 20,
    tn: 4420,
  });

  // Model B default: High precision / conservative
  const [modelB, setModelB] = useState<MatrixValues>({
    tp: 260,
    fp: 30,
    fn: 140,
    tn: 4570,
  });

  const [businessGoal, setBusinessGoal] = useState<
    'min_fn' | 'min_fp' | 'balanced'
  >('min_fn');

  const metricsA = calculateMetrics(modelA);
  const metricsB = calculateMetrics(modelB);

  // Trigger achievement if callback provided
  const handleSelectGoal = (goal: 'min_fn' | 'min_fp' | 'balanced') => {
    setBusinessGoal(goal);
    if (onComparisonCompleted) onComparisonCompleted();
  };

  const setPresetComparison = (preset: 'tradeoff' | 'same_acc' | 'imbalanced') => {
    if (preset === 'tradeoff') {
      setModelA({ tp: 380, fp: 180, fn: 20, tn: 4420 }); // Recall: 95.0%, Prec: 67.9%
      setModelB({ tp: 260, fp: 30, fn: 140, tn: 4570 }); // Recall: 65.0%, Prec: 89.7%
    } else if (preset === 'same_acc') {
      // Both Total 1000.
      // Model A: TP=180, FP=70, FN=50, TN=700 -> Acc = 880/1000 = 88.0%, Rec = 180/230 = 78.3%, Prec = 180/250 = 72.0%
      // Model B: TP=70, FP=20, FN=100, TN=810 -> Acc = 880/1000 = 88.0%, Rec = 70/170 = 41.2%, Prec = 70/90 = 77.8%
      setModelA({ tp: 180, fp: 70, fn: 50, tn: 700 });
      setModelB({ tp: 70, fp: 20, fn: 100, tn: 810 });
    } else if (preset === 'imbalanced') {
      // 99% accuracy trivial vs 95% accuracy with real recall
      setModelA({ tp: 90, fp: 25, fn: 10, tn: 875 }); // Acc: 96.5%, Rec: 90.0%
      setModelB({ tp: 0, fp: 0, fn: 100, tn: 900 });  // Acc: 90.0%, Rec: 0.0%
    }
  };

  // Generate dynamic recommendation
  const getRecommendation = () => {
    const accA = metricsA.accuracy.value ?? 0;
    const accB = metricsB.accuracy.value ?? 0;
    const recA = metricsA.recall.value ?? 0;
    const recB = metricsB.recall.value ?? 0;
    const precA = metricsA.precision.value ?? 0;
    const precB = metricsB.precision.value ?? 0;
    const f1A = metricsA.f1Score.value ?? 0;
    const f1B = metricsB.f1Score.value ?? 0;

    if (businessGoal === 'min_fn') {
      const winner = recA >= recB ? 'Modelo A' : 'Modelo B';
      const winnerRec = recA >= recB ? metricsA.recall.formatted : metricsB.recall.formatted;
      const loserFn = recA >= recB ? modelB.fn : modelA.fn;
      const winnerFn = recA >= recB ? modelA.fn : modelB.fn;

      return {
        winner,
        reason: `Dado que el objetivo prioritario es minimizar los Falsos Negativos (evitar omisiones críticas), se recomienda el ${winner}. Logra una Sensibilidad (Recall) del ${winnerRec}, dejando escapar solo ${winnerFn} casos positivos, frente a los ${loserFn} casos omitidos por el otro modelo. Aunque pueda generar algunas falsas alarmas adicionales, protege a la organización del riesgo de mayor costo.`,
        caution:
          'Importante: No te dejes guiar únicamente por el Accuracy global. El valor comercial aquí radica en no dejar pasar positivos reales.',
      };
    }

    if (businessGoal === 'min_fp') {
      const winner = precA >= precB ? 'Modelo A' : 'Modelo B';
      const winnerPrec = precA >= precB ? metricsA.precision.formatted : metricsB.precision.formatted;
      const loserFp = precA >= precB ? modelB.fp : modelA.fp;
      const winnerFp = precA >= precB ? modelA.fp : modelB.fp;

      return {
        winner,
        reason: `Dado que el objetivo prioritario es evitar las falsas alarmas (reducir los Falsos Positivos por altos costos operativos o de imagen), se recomienda el ${winner}. Ofrece una Precisión del ${winnerPrec}, generando solo ${winnerFp} falsas alarmas frente a las ${loserFp} del competidor.`,
        caution:
          'Advertencia: Al exigir tanta precisión, es probable que se estén omitiendo más positivos reales (menor Recall). Asegúrate de que el costo de esas omisiones sea asumible.',
      };
    }

    // Balanced / F1
    const winner = f1A >= f1B ? 'Modelo A' : 'Modelo B';
    const winnerF1 = f1A >= f1B ? metricsA.f1Score.formatted : metricsB.f1Score.formatted;
    return {
      winner,
      reason: `Para un balance equilibrado entre ambos tipos de errores, se recomienda el ${winner} por presentar el mejor F1-Score (${winnerF1}). La media armónica premia el balance sano entre evitar falsas alarmas y capturar positivos.`,
      caution:
        'Si las condiciones del mercado cambian (por ejemplo, si el presupuesto se recorta a la mitad), deberás recalibrar el umbral hacia mayor precisión.',
    };
  };

  const recommendation = getRecommendation();

  // Helper delta formatter
  const renderDelta = (valA: number | null, valB: number | null) => {
    if (valA === null || valB === null) return '-';
    const diff = (valA - valB) * 100;
    if (Math.abs(diff) < 0.1) return <span className="text-slate-400 font-mono">Igual</span>;
    if (diff > 0) {
      return (
        <span className="text-emerald-600 font-mono font-bold">
          +{diff.toFixed(1)}% (A)
        </span>
      );
    }
    return (
      <span className="text-indigo-600 font-mono font-bold">
        +{(Math.abs(diff)).toFixed(1)}% (B)
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <GitCompare className="w-3.5 h-3.5" />
              Módulo 5 • Comparador de Modelos Lado a Lado
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Evaluación Competitiva y Compromisos (Trade-Offs)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Un modelo con mayor Accuracy puede ser un pésimo negocio si comete los errores equivocados.
              Compara dos modelos frente a frente y selecciona la decisión óptima según tu objetivo empresarial.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs self-start">
            <button
              onClick={() => setPresetComparison('tradeoff')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
            >
              Sensible vs Conservador
            </button>
            <button
              onClick={() => setPresetComparison('same_acc')}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold rounded-xl border border-indigo-200 transition"
            >
              Mismo Accuracy, Desempeño Opuesto
            </button>
          </div>
        </div>

        {/* Business Objective Selector */}
        <div className="mt-6">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Paso 1: Define la Prioridad Estratégica del Negocio:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleSelectGoal('min_fn')}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                businessGoal === 'min_fn'
                  ? 'bg-rose-50/70 border-rose-500 ring-2 ring-rose-400/40 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-rose-900">
                  1. Minimizar Falsos Negativos (FN)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md">
                  Recall
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Para salud, fraude o seguridad. Dejar escapar un caso positivo real acarrea consecuencias críticas.
              </p>
            </button>

            <button
              onClick={() => handleSelectGoal('min_fp')}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                businessGoal === 'min_fp'
                  ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-400/40 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-amber-900">
                  2. Minimizar Falsos Positivos (FP)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">
                  Precision
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Para presupuestos ajustados de marketing o evitar quejas de clientes por bloqueos erróneos.
              </p>
            </button>

            <button
              onClick={() => handleSelectGoal('balanced')}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                businessGoal === 'balanced'
                  ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-400/40 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-indigo-950">
                  3. Equilibrio Operativo Global
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">
                  F1-Score
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Para escenarios balanceados donde ambos tipos de error tienen un costo económico similar.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-side matrices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model A Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                A
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Modelo A (Configurable)</h3>
                <span className="text-[11px] text-slate-400">Total: {metricsA.total.toLocaleString()} casos</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase">Exactitud</div>
              <div className="text-lg font-black text-slate-900">{metricsA.accuracy.formatted}</div>
            </div>
          </div>

          {/* 2x2 table for A */}
          <table className="w-full text-xs text-center border-separate border-spacing-2">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase">
                <th className="p-1"></th>
                <th className="p-1 bg-slate-50 rounded-md">Pred: Pos (+)</th>
                <th className="p-1 bg-slate-50 rounded-md">Pred: Neg (-)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="p-2 bg-slate-50 rounded-md text-[10px] font-bold text-slate-600 text-left">Real: Pos</th>
                <td className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
                  <div className="text-[10px] font-extrabold text-emerald-800">TP</div>
                  <div className="text-xl font-black text-emerald-950">{modelA.tp}</div>
                </td>
                <td className="p-3 bg-rose-50 border border-rose-300 rounded-xl">
                  <div className="text-[10px] font-extrabold text-rose-800">FN</div>
                  <div className="text-xl font-black text-rose-950">{modelA.fn}</div>
                </td>
              </tr>
              <tr>
                <th className="p-2 bg-slate-50 rounded-md text-[10px] font-bold text-slate-600 text-left">Real: Neg</th>
                <td className="p-3 bg-amber-50 border border-amber-300 rounded-xl">
                  <div className="text-[10px] font-extrabold text-amber-800">FP</div>
                  <div className="text-xl font-black text-amber-950">{modelA.fp}</div>
                </td>
                <td className="p-3 bg-blue-50 border border-blue-300 rounded-xl">
                  <div className="text-[10px] font-extrabold text-blue-800">TN</div>
                  <div className="text-xl font-black text-blue-950">{modelA.tn}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Metrics highlights */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="text-[10px] font-bold text-emerald-800">Precision</div>
              <div className="text-base font-black text-emerald-950">{metricsA.precision.formatted}</div>
            </div>
            <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200">
              <div className="text-[10px] font-bold text-indigo-800">Recall</div>
              <div className="text-base font-black text-indigo-950">{metricsA.recall.formatted}</div>
            </div>
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-[10px] font-bold text-purple-800">F1-Score</div>
              <div className="text-base font-black text-purple-950">{metricsA.f1Score.formatted}</div>
            </div>
          </div>
        </div>

        {/* Model B Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                B
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Modelo B (Configurable)</h3>
                <span className="text-[11px] text-slate-400">Total: {metricsB.total.toLocaleString()} casos</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase">Exactitud</div>
              <div className="text-lg font-black text-slate-900">{metricsB.accuracy.formatted}</div>
            </div>
          </div>

          {/* 2x2 table for B */}
          <table className="w-full text-xs text-center border-separate border-spacing-2">
            <thead>
              <tr className="text-slate-400 text-[10px] uppercase">
                <th className="p-1"></th>
                <th className="p-1 bg-slate-50 rounded-md">Pred: Pos (+)</th>
                <th className="p-1 bg-slate-50 rounded-md">Pred: Neg (-)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="p-2 bg-slate-50 rounded-md text-[10px] font-bold text-slate-600 text-left">Real: Pos</th>
                <td className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
                  <div className="text-[10px] font-extrabold text-emerald-800">TP</div>
                  <div className="text-xl font-black text-emerald-950">{modelB.tp}</div>
                </td>
                <td className="p-3 bg-rose-50 border border-rose-300 rounded-xl">
                  <div className="text-[10px] font-extrabold text-rose-800">FN</div>
                  <div className="text-xl font-black text-rose-950">{modelB.fn}</div>
                </td>
              </tr>
              <tr>
                <th className="p-2 bg-slate-50 rounded-md text-[10px] font-bold text-slate-600 text-left">Real: Neg</th>
                <td className="p-3 bg-amber-50 border border-amber-300 rounded-xl">
                  <div className="text-[10px] font-extrabold text-amber-800">FP</div>
                  <div className="text-xl font-black text-amber-950">{modelB.fp}</div>
                </td>
                <td className="p-3 bg-blue-50 border border-blue-300 rounded-xl">
                  <div className="text-[10px] font-extrabold text-blue-800">TN</div>
                  <div className="text-xl font-black text-blue-950">{modelB.tn}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Metrics highlights */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="text-[10px] font-bold text-emerald-800">Precision</div>
              <div className="text-base font-black text-emerald-950">{metricsB.precision.formatted}</div>
            </div>
            <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-200">
              <div className="text-[10px] font-bold text-indigo-800">Recall</div>
              <div className="text-base font-black text-indigo-950">{metricsB.recall.formatted}</div>
            </div>
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-[10px] font-bold text-purple-800">F1-Score</div>
              <div className="text-base font-black text-purple-950">{metricsB.f1Score.formatted}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Delta Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h4 className="font-extrabold text-slate-900 text-sm mb-3">
          Tabla Comparativa y Diferencias Clave (Deltas):
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold text-[11px] uppercase">
                <th className="py-2.5">Métrica</th>
                <th className="py-2.5 text-center text-emerald-700">Modelo A</th>
                <th className="py-2.5 text-center text-indigo-700">Modelo B</th>
                <th className="py-2.5 text-right">Ventaja Relativa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 font-semibold text-slate-800">Accuracy (Exactitud)</td>
                <td className="py-3 text-center font-bold">{metricsA.accuracy.formatted}</td>
                <td className="py-3 text-center font-bold">{metricsB.accuracy.formatted}</td>
                <td className="py-3 text-right">{renderDelta(metricsA.accuracy.value, metricsB.accuracy.value)}</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">Precision (Precisión)</td>
                <td className="py-3 text-center font-bold text-emerald-800">{metricsA.precision.formatted}</td>
                <td className="py-3 text-center font-bold text-emerald-800">{metricsB.precision.formatted}</td>
                <td className="py-3 text-right">{renderDelta(metricsA.precision.value, metricsB.precision.value)}</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">Recall / Sensibilidad</td>
                <td className="py-3 text-center font-bold text-indigo-800">{metricsA.recall.formatted}</td>
                <td className="py-3 text-center font-bold text-indigo-800">{metricsB.recall.formatted}</td>
                <td className="py-3 text-right">{renderDelta(metricsA.recall.value, metricsB.recall.value)}</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">F1-Score</td>
                <td className="py-3 text-center font-bold text-purple-800">{metricsA.f1Score.formatted}</td>
                <td className="py-3 text-center font-bold text-purple-800">{metricsB.f1Score.formatted}</td>
                <td className="py-3 text-right">{renderDelta(metricsA.f1Score.value, metricsB.f1Score.value)}</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">Falsas Alarmas (Falsos Positivos)</td>
                <td className="py-3 text-center font-bold text-amber-800">{modelA.fp} casos</td>
                <td className="py-3 text-center font-bold text-amber-800">{modelB.fp} casos</td>
                <td className="py-3 text-right font-mono text-slate-600">
                  {modelA.fp < modelB.fp ? 'Modelo A genera menos FP' : 'Modelo B genera menos FP'}
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-slate-800">Omisiones Críticas (Falsos Negativos)</td>
                <td className="py-3 text-center font-bold text-rose-800">{modelA.fn} casos</td>
                <td className="py-3 text-center font-bold text-rose-800">{modelB.fn} casos</td>
                <td className="py-3 text-right font-mono text-slate-600">
                  {modelA.fn < modelB.fn ? 'Modelo A deja escapar menos FN' : 'Modelo B deja escapar menos FN'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Automated Reasoned Business Recommendation */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          Recomendación Razonada de Negocio
        </div>

        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-black rounded-lg uppercase">
            Elección Sugerida:
          </span>
          <h3 className="text-xl sm:text-2xl font-black">{recommendation.winner}</h3>
        </div>

        <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-medium mb-4">
          {recommendation.reason}
        </p>

        <div className="p-3.5 bg-white/10 rounded-xl border border-white/15 text-xs text-amber-200">
          <strong>Criterio Experto: </strong>
          {recommendation.caution}
        </div>
      </div>
    </div>
  );
};
