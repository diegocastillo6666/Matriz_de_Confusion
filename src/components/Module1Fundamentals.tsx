import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { FUNDAMENTAL_CONCEPTS } from '../data/fundamentals';

interface Module1Props {
  onCompleteModule: () => void;
  onNavigateToMatrix: () => void;
}

export const Module1Fundamentals: React.FC<Module1Props> = ({
  onCompleteModule,
  onNavigateToMatrix,
}) => {
  const [selectedConcept, setSelectedConcept] = useState<string>(FUNDAMENTAL_CONCEPTS[0].id);
  const [showParadoxSimulation, setShowParadoxSimulation] = useState<boolean>(false);
  const [activeMulticlassTab, setActiveMulticlassTab] = useState<'perro' | 'gato' | 'pajaro'>('perro');

  const currentConcept = FUNDAMENTAL_CONCEPTS.find((c) => c.id === selectedConcept) || FUNDAMENTAL_CONCEPTS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/30 border border-indigo-400/40 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-200 mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Módulo 1 • Fundamentos Esenciales
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            ¿Cómo entender realmente la Matriz de Confusión?
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 leading-relaxed">
            En Machine Learning, una predicción no es simplemente "correcta" o "incorrecta".
            Los errores tienen diferentes nombres, naturalezas y consecuencias económicas o humanas.
            Descubre los principios teóricos indispensables antes de pasar a la práctica interactiva.
          </p>
        </div>
      </div>

      {/* Concept Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation list */}
        <div className="space-y-2 md:col-span-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Temas del Módulo
          </div>
          {FUNDAMENTAL_CONCEPTS.map((concept, index) => {
            const isSelected = selectedConcept === concept.id;
            return (
              <button
                key={concept.id}
                onClick={() => setSelectedConcept(concept.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div>
                  <div className={`text-xs font-bold ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                    {concept.title.replace(/^\d+\.\s*/, '')}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {concept.shortSummary}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Concept Viewer */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Concepto Teórico</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{currentConcept.title}</h2>
            <p className="text-sm text-slate-600 mt-2 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
              {currentConcept.shortSummary}
            </p>
          </div>

          {/* Paragraphs */}
          <div className="space-y-3 text-sm text-slate-700 leading-relaxed mb-6">
            {currentConcept.content.map((p, idx) => (
              <p key={idx} className={p.startsWith('•') ? 'font-semibold pl-2 text-slate-800' : ''}>
                {p}
              </p>
            ))}
          </div>

          {/* Everyday Analogy Callout */}
          {currentConcept.analogyTitle && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 rounded-2xl p-4 sm:p-5 mb-6">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Analogía para recordar: {currentConcept.analogyTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950/90 whitespace-pre-line leading-relaxed">
                {currentConcept.analogyContent}
              </p>
            </div>
          )}

          {/* Key Takeaway Box */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-indigo-950 font-medium">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-indigo-900">Idea clave para llevarte: </strong>
              {currentConcept.takeaway}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Feature: Accuracy Paradox Live Visualizer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Demostración Práctica
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              La Paradoja de la Exactitud (Accuracy Paradox)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Observa cómo un modelo que "no hace nada" puede obtener un 99.0% de exactitud aparente.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start">
            <button
              onClick={() => setShowParadoxSimulation(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                !showParadoxSimulation ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'
              }`}
            >
              Datos Balanceados (50/50)
            </button>
            <button
              onClick={() => setShowParadoxSimulation(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                showParadoxSimulation ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Datos Desbalanceados (99/1) ⚠️
            </button>
          </div>
        </div>

        {!showParadoxSimulation ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <p>
                <strong>Escenario A (Población Balanceada):</strong> Evaluamos a 1,000 personas donde 500 están
                enfermas y 500 están sanas.
              </p>
              <p>
                Un modelo entrenado clasifica con acierto a 420 enfermos (TP) y a 430 sanos (TN), cometiendo 150
                errores en total.
              </p>
              <div className="grid grid-cols-2 gap-2 text-center pt-2">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="text-[11px] font-bold text-emerald-800">Accuracy Global</div>
                  <div className="text-2xl font-black text-emerald-700">85.0%</div>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <div className="text-[11px] font-bold text-indigo-800">Recall (Sensibilidad)</div>
                  <div className="text-2xl font-black text-indigo-700">84.0%</div>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Aquí el Accuracy del 85% refleja razonablemente bien el buen rendimiento general del modelo.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <div className="text-xs font-bold text-slate-500 mb-2">Matriz de Contingencia (Balanceada)</div>
              <table className="w-full text-xs font-medium">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="p-2">Real \\ Pred</th>
                    <th className="p-2 text-emerald-700">Pred: Enfermo (+)</th>
                    <th className="p-2 text-indigo-700">Pred: Sano (-)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 font-bold text-slate-700">Real: Enfermo</td>
                    <td className="p-2 bg-emerald-100/70 text-emerald-900 font-bold rounded-md">TP = 420</td>
                    <td className="p-2 bg-rose-100/70 text-rose-900 font-bold rounded-md">FN = 80</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-700">Real: Sano</td>
                    <td className="p-2 bg-amber-100/70 text-amber-900 font-bold rounded-md">FP = 70</td>
                    <td className="p-2 bg-blue-100/70 text-blue-900 font-bold rounded-md">TN = 430</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-amber-50/40 p-4 rounded-xl border border-amber-200">
            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                ¡El Modelo Trivial o "Tramposo"!
              </div>
              <p>
                <strong>Escenario B (Enfermedad Rara):</strong> De 1,000 personas, 990 están sanas y solo 10
                enfermas (1% prevalencia).
              </p>
              <p>
                Un algoritmo perezoso que predice <strong>"SANO" para el 100% de los casos</strong> obtendrá:
              </p>
              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl">
                  <div className="text-[11px] font-bold text-emerald-800">Accuracy (Parece increíble)</div>
                  <div className="text-2xl font-black text-emerald-700">99.0%</div>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl">
                  <div className="text-[11px] font-bold text-rose-800">Recall Real (¡Peligro!)</div>
                  <div className="text-2xl font-black text-rose-700">0.0%</div>
                </div>
              </div>
              <p className="text-xs text-rose-900 font-medium">
                ¡El modelo no detectó a ningún enfermo! Por eso nunca debemos confiar exclusivamente en el Accuracy.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200 text-center shadow-xs">
              <div className="text-xs font-bold text-slate-500 mb-2">Matriz de la Paradoja (99% Desbalance)</div>
              <table className="w-full text-xs font-medium">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="p-2">Real \\ Pred</th>
                    <th className="p-2 text-emerald-700">Pred: Enfermo (+)</th>
                    <th className="p-2 text-indigo-700">Pred: Sano (-)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 font-bold text-slate-700">Real: Enfermo (10)</td>
                    <td className="p-2 bg-emerald-50 text-emerald-900 font-bold rounded-md">TP = 0</td>
                    <td className="p-2 bg-rose-200 text-rose-950 font-black rounded-md">FN = 10 (¡100% error!)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-700">Real: Sano (990)</td>
                    <td className="p-2 bg-amber-50 text-amber-900 font-bold rounded-md">FP = 0</td>
                    <td className="p-2 bg-blue-100 text-blue-900 font-bold rounded-md">TN = 990 (Aciertos triviales)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Multiclass Matrix Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="mb-4">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Extensión Multiclase</span>
          <h3 className="text-xl font-black text-slate-900 mt-1">
            ¿Cómo se ve una Matriz cuando hay más de dos clases? (3×3)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            En un clasificador de visión artificial de animales (Perro, Gato, Pájaro), cada fila sigue siendo la
            clase real y cada columna la predicción.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-separate border-spacing-1.5 text-center">
              <thead>
                <tr>
                  <th className="p-2 bg-slate-100 rounded-lg text-slate-500 font-bold">Realidad \\ Predicción</th>
                  <th className="p-2 bg-indigo-50 text-indigo-900 font-bold rounded-lg">Pred: Perro 🐶</th>
                  <th className="p-2 bg-amber-50 text-amber-900 font-bold rounded-lg">Pred: Gato 🐱</th>
                  <th className="p-2 bg-emerald-50 text-emerald-900 font-bold rounded-lg">Pred: Pájaro 🐦</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="p-2 bg-indigo-50 text-indigo-950 font-bold text-left rounded-lg">Real: Perro</th>
                  <td className="p-3 bg-emerald-100 text-emerald-900 font-extrabold rounded-lg border-2 border-emerald-500">
                    45 (TP Perro)
                  </td>
                  <td className="p-3 bg-rose-50 text-rose-800 font-medium rounded-lg">4 (Confundido con Gato)</td>
                  <td className="p-3 bg-rose-50 text-rose-800 font-medium rounded-lg">1 (Confundido con Pájaro)</td>
                </tr>
                <tr>
                  <th className="p-2 bg-amber-50 text-amber-950 font-bold text-left rounded-lg">Real: Gato</th>
                  <td className="p-3 bg-rose-50 text-rose-800 font-medium rounded-lg">6 (Confundido con Perro)</td>
                  <td className="p-3 bg-emerald-100 text-emerald-900 font-extrabold rounded-lg border-2 border-emerald-500">
                    38 (TP Gato)
                  </td>
                  <td className="p-3 bg-rose-50 text-rose-800 font-medium rounded-lg">2 (Confundido con Pájaro)</td>
                </tr>
                <tr>
                  <th className="p-2 bg-emerald-50 text-emerald-950 font-bold text-left rounded-lg">Real: Pájaro</th>
                  <td className="p-3 bg-rose-50 text-rose-800 font-medium rounded-lg">0</td>
                  <td className="p-3 bg-rose-50 text-rose-800 font-medium rounded-lg">3</td>
                  <td className="p-3 bg-emerald-100 text-emerald-900 font-extrabold rounded-lg border-2 border-emerald-500">
                    51 (TP Pájaro)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Regla de Oro Multiclase:
            </div>
            <p>
              • <strong>Diagonal principal verde:</strong> Son todos los aciertos perfectos de cada especie (45 + 38 + 51 = 134 aciertos).
            </p>
            <p>
              • <strong>Fuera de la diagonal:</strong> Te indica dónde se equivoca el modelo. Por ejemplo, 6 gatos fueron catalogados como perros.
            </p>
            <p>
              • <strong>Técnica One-vs-Rest:</strong> Para calcular el Recall de "Perro", tratamos a Perro como Positivo (45) y a todo lo demás como Negativo.
            </p>
          </div>
        </div>
      </div>

      {/* Completion CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 gap-4">
        <div>
          <h4 className="font-bold text-indigo-950 text-base">¡Has revisado los fundamentos teóricos!</h4>
          <p className="text-xs text-indigo-800 mt-0.5">
            Ahora pon en práctica estos conceptos manipulando directamente las 4 celdas en la Matriz Interactiva.
          </p>
        </div>
        <button
          onClick={() => {
            onCompleteModule();
            onNavigateToMatrix();
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition shrink-0"
        >
          <span>Ir a la Matriz Interactiva</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
