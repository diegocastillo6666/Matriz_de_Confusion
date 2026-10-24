import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  Flame,
  Clock,
  Target,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CHALLENGE_QUESTIONS, FINAL_EXAM_QUESTIONS } from '../data/quizzes';
import { ChallengeQuestion, FinalExamQuestion } from '../types';

interface Module5Props {
  xp: number;
  level: string;
  onAddXp: (amount: number, reason: string) => void;
  onFinalExamCompleted: (score: number) => void;
  finalExamScore: number | null;
}

export const Module5Gamification: React.FC<Module5Props> = ({
  xp,
  level,
  onAddXp,
  onFinalExamCompleted,
  finalExamScore,
}) => {
  const [activeTab, setActiveTab] = useState<'retos' | 'examen'>('retos');
  const [difficultyFilter, setDifficultyFilter] = useState<'Todos' | 'Principiante' | 'Intermedio' | 'Avanzado'>('Todos');

  // Challenge state
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(CHALLENGE_QUESTIONS[0].id);
  const [challengeAnswers, setChallengeAnswers] = useState<Record<string, number>>({});
  const [challengeSubmitted, setChallengeSubmitted] = useState<Record<string, boolean>>({});
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);

  // Exam state
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [currentExamIndex, setCurrentExamIndex] = useState<number>(0);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number | null>(finalExamScore);

  const filteredChallenges = CHALLENGE_QUESTIONS.filter(
    (q) => difficultyFilter === 'Todos' || q.difficulty === difficultyFilter
  );

  const currentChallenge =
    CHALLENGE_QUESTIONS.find((q) => q.id === selectedChallengeId) || CHALLENGE_QUESTIONS[0];

  const handleSelectChallengeAnswer = (questionId: string, optionIndex: number) => {
    if (challengeSubmitted[questionId]) return;
    setChallengeAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitChallenge = (question: ChallengeQuestion) => {
    const selected = challengeAnswers[question.id];
    if (selected === undefined) return;

    setChallengeSubmitted((prev) => ({ ...prev, [question.id]: true }));

    if (selected === question.correctIndex) {
      if (!solvedChallenges.includes(question.id)) {
        setSolvedChallenges((prev) => [...prev, question.id]);
        onAddXp(question.xpReward, `Reto superado: ${question.title}`);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    }
  };

  const handleRetryChallenge = (questionId: string) => {
    setChallengeSubmitted((prev) => ({ ...prev, [questionId]: false }));
    setChallengeAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  // Exam logic
  const handleSelectExamAnswer = (questionId: number, optionIndex: number) => {
    setExamAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleFinishExam = () => {
    let correctCount = 0;
    FINAL_EXAM_QUESTIONS.forEach((q) => {
      if (examAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    setExamScore(correctCount);
    setExamSubmitted(true);
    onFinalExamCompleted(correctCount);

    if (correctCount >= 8) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
      onAddXp(150, 'Graduado con Honores en el Examen Final');
    } else {
      onAddXp(50, 'Examen Final completado');
    }
  };

  const handleRetakeExam = () => {
    setExamAnswers({});
    setExamSubmitted(false);
    setCurrentExamIndex(0);
    setExamStarted(true);
  };

  // Exam Concept Mastery Breakdown
  const masteredTopics: string[] = [];
  const reviewTopics: string[] = [];

  if (examSubmitted) {
    FINAL_EXAM_QUESTIONS.forEach((q) => {
      const isCorrect = examAnswers[q.id] === q.correctIndex;
      if (isCorrect) {
        if (!masteredTopics.includes(q.topic)) masteredTopics.push(q.topic);
      } else {
        if (!reviewTopics.includes(q.topic)) reviewTopics.push(q.topic);
      }
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              Módulo 6 • Gamificación y Aprendizaje Activo
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Retos Prácticos y Examen de Certificación
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Consolida tu conocimiento mediante ejercicios interactivos con retroalimentación pedagógica inmediata.
              Gana puntos de experiencia (XP), desbloquea insignias y pon a prueba tu dominio en el examen final.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl self-start">
            <button
              onClick={() => setActiveTab('retos')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'retos' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Target className="w-4 h-4" />
              Retos por Nivel ({solvedChallenges.length}/{CHALLENGE_QUESTIONS.length})
            </button>
            <button
              onClick={() => setActiveTab('examen')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'examen' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Examen Final {examScore !== null ? `(${examScore}/10)` : ''}
            </button>
          </div>
        </div>

        {/* User XP stats summary */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
              <Zap className="w-5 h-5 fill-white" />
            </span>
            <div>
              <div className="text-xs text-amber-900 font-bold">Rango Actual: {level}</div>
              <div className="text-xl font-black text-amber-950">{xp} Puntos XP Acumulados</div>
            </div>
          </div>
          <div className="text-xs text-amber-800 font-medium">
            Retos resueltos: <strong>{solvedChallenges.length}</strong> de {CHALLENGE_QUESTIONS.length}
          </div>
        </div>
      </div>

      {/* TAB 1: RETOS POR NIVEL */}
      {activeTab === 'retos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Difficulty and Challenge Selector */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Biblioteca de Desafíos</h3>
              <div className="flex gap-1 text-[11px]">
                {(['Todos', 'Principiante', 'Intermedio', 'Avanzado'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`px-2 py-0.5 rounded-md font-bold transition ${
                      difficultyFilter === diff
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filteredChallenges.map((challenge) => {
                const isSelected = selectedChallengeId === challenge.id;
                const isSolved = solvedChallenges.includes(challenge.id);

                return (
                  <button
                    key={challenge.id}
                    onClick={() => setSelectedChallengeId(challenge.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 shadow-xs ring-1 ring-indigo-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            challenge.difficulty === 'Principiante'
                              ? 'bg-emerald-100 text-emerald-800'
                              : challenge.difficulty === 'Intermedio'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {challenge.difficulty}
                        </span>
                        <span className="text-[10px] text-amber-700 font-bold">+{challenge.xpReward} XP</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900">{challenge.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{challenge.scenario}</div>
                    </div>
                    {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Challenge Interactive Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                Desafío Interactivo • {currentChallenge.difficulty}
              </span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                +{currentChallenge.xpReward} XP
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">{currentChallenge.title}</h3>
              <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {currentChallenge.scenario}
              </div>
            </div>

            {/* Optional Matrix for Blind Challenge */}
            {currentChallenge.matrixData && (
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-center">
                <div className="text-xs font-bold text-purple-900 mb-2">Datos de la Matriz Sometida a Auditoría:</div>
                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  <div className="bg-white p-2 rounded-lg border">TP: <strong>{currentChallenge.matrixData.tp}</strong></div>
                  <div className="bg-white p-2 rounded-lg border">FP: <strong>{currentChallenge.matrixData.fp}</strong></div>
                  <div className="bg-white p-2 rounded-lg border">FN: <strong>{currentChallenge.matrixData.fn}</strong></div>
                  <div className="bg-white p-2 rounded-lg border">TN: <strong>{currentChallenge.matrixData.tn}</strong></div>
                </div>
              </div>
            )}

            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Pregunta del Reto:
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mb-4">
                {currentChallenge.question}
              </h4>

              {/* Options */}
              <div className="space-y-2.5">
                {currentChallenge.options.map((opt, idx) => {
                  const isSelected = challengeAnswers[currentChallenge.id] === idx;
                  const isSubmitted = challengeSubmitted[currentChallenge.id];
                  const isCorrect = idx === currentChallenge.correctIndex;

                  let cardStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                  if (isSubmitted) {
                    if (isCorrect) {
                      cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500';
                    } else if (isSelected) {
                      cardStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-400/40';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted && challengeAnswers[currentChallenge.id] === currentChallenge.correctIndex}
                      onClick={() => handleSelectChallengeAnswer(currentChallenge.id, idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${cardStyle}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions & Feedback */}
            {!challengeSubmitted[currentChallenge.id] ? (
              <button
                onClick={() => handleSubmitChallenge(currentChallenge)}
                disabled={challengeAnswers[currentChallenge.id] === undefined}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition"
              >
                Comprobar Respuesta
              </button>
            ) : (
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                    challengeAnswers[currentChallenge.id] === currentChallenge.correctIndex
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="font-bold mb-1">
                    {challengeAnswers[currentChallenge.id] === currentChallenge.correctIndex
                      ? '🎉 ¡Respuesta Correcta!'
                      : '❌ Incorrecto. Revisa la retroalimentación:'}
                  </div>
                  <p>{currentChallenge.explanation}</p>
                </div>

                {challengeAnswers[currentChallenge.id] !== currentChallenge.correctIndex && (
                  <button
                    onClick={() => handleRetryChallenge(currentChallenge.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Volver a Intentarlo
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EXAMEN FINAL */}
      {activeTab === 'examen' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {!examStarted && !examSubmitted ? (
            <div className="max-w-2xl mx-auto text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Examen Final de la Matriz de Confusión
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Este examen consta de <strong>10 preguntas de selección múltiple</strong> diseñadas para evaluar tu
                comprensión integral de conceptos, fórmulas matemáticas, interpretación de errores y decisiones
                empresariales en Machine Learning.
              </p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1 inline-block text-left">
                <div>• Número de preguntas: <strong>10 preguntas</strong></div>
                <div>• Nota mínima para aprobar: <strong>8 / 10 (80%)</strong></div>
                <div>• Recompensa: <strong>Insignia "Científico de Datos Graduado" + 150 XP</strong></div>
              </div>
              <div>
                <button
                  onClick={() => setExamStarted(true)}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-md transition"
                >
                  Comenzar Examen Ahora
                </button>
              </div>
            </div>
          ) : !examSubmitted ? (
            /* Exam Active Flow */
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                    Examen Final • Pregunta {currentExamIndex + 1} de {FINAL_EXAM_QUESTIONS.length}
                  </span>
                  <div className="text-xs text-slate-400">
                    Tema: {FINAL_EXAM_QUESTIONS[currentExamIndex].topic}
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-slate-500">
                  Progreso: {Math.round(((currentExamIndex + 1) / FINAL_EXAM_QUESTIONS.length) * 100)}%
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 transition-all duration-300"
                  style={{ width: `${((currentExamIndex + 1) / FINAL_EXAM_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Current Question */}
              <div className="py-2">
                <h4 className="text-base sm:text-lg font-black text-slate-900 mb-4">
                  {FINAL_EXAM_QUESTIONS[currentExamIndex].question}
                </h4>

                <div className="space-y-3">
                  {FINAL_EXAM_QUESTIONS[currentExamIndex].options.map((opt, idx) => {
                    const questionId = FINAL_EXAM_QUESTIONS[currentExamIndex].id;
                    const isSelected = examAnswers[questionId] === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectExamAnswer(questionId, idx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition flex items-center gap-3 ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-400/40'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={currentExamIndex === 0}
                  onClick={() => setCurrentExamIndex((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40 hover:bg-slate-50 transition"
                >
                  Anterior
                </button>

                {currentExamIndex < FINAL_EXAM_QUESTIONS.length - 1 ? (
                  <button
                    disabled={examAnswers[FINAL_EXAM_QUESTIONS[currentExamIndex].id] === undefined}
                    onClick={() => setCurrentExamIndex((p) => p + 1)}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    Siguiente Pregunta
                  </button>
                ) : (
                  <button
                    disabled={Object.keys(examAnswers).length < FINAL_EXAM_QUESTIONS.length}
                    onClick={handleFinishExam}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-md transition"
                  >
                    Finalizar y Calificar Examen
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Exam Results Screen */
            <div className="space-y-8">
              <div className="text-center py-6 border-b border-slate-100">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl font-black mb-3 ${
                    (examScore ?? 0) >= 8
                      ? 'bg-emerald-100 text-emerald-800 ring-8 ring-emerald-50'
                      : 'bg-amber-100 text-amber-800 ring-8 ring-amber-50'
                  }`}
                >
                  {examScore}/10
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  {(examScore ?? 0) >= 8 ? '¡Felicitaciones! Has Aprobado con Éxito 🎉' : 'Has finalizado el Examen'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {(examScore ?? 0) >= 8
                    ? 'Has demostrado un dominio sólido de la matriz de confusión y sus implicaciones empresariales.'
                    : 'Obtuviste menos de 8 aciertos. Revisa las preguntas falladas y vuelve a intentarlo para afianzar tus conocimientos.'}
                </p>

                <div className="mt-4 flex justify-center gap-3">
                  <button
                    onClick={handleRetakeExam}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Repetir Examen
                  </button>
                </div>
              </div>

              {/* Concept Mastery Summary Required by Prompt */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Conceptos Dominados:
                  </div>
                  {masteredTopics.length > 0 ? (
                    <ul className="text-xs text-emerald-950 space-y-1">
                      {masteredTopics.map((topic, i) => (
                        <li key={i}>✓ {topic}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No dominaste ningún tema aún.</p>
                  )}
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Conceptos que Conviene Repasar:
                  </div>
                  {reviewTopics.length > 0 ? (
                    <ul className="text-xs text-amber-950 space-y-1">
                      {reviewTopics.map((topic, i) => (
                        <li key={i}>⚠️ {topic}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-700 font-bold">¡Ninguno! Dominaste todos los temas.</p>
                  )}
                </div>
              </div>

              {/* Detailed Breakdown of all 10 Questions */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Desglose y Explicación Detallada de cada Pregunta:
                </h4>

                <div className="space-y-3">
                  {FINAL_EXAM_QUESTIONS.map((q, idx) => {
                    const userAnswer = examAnswers[q.id];
                    const isCorrect = userAnswer === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border text-xs leading-relaxed ${
                          isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="font-bold text-slate-900">
                            {idx + 1}. {q.question}
                          </span>
                          {isCorrect ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-bold shrink-0">
                              Correcto (+1)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md text-[10px] font-bold shrink-0">
                              Fallada
                            </span>
                          )}
                        </div>

                        <div className="text-slate-600 space-y-0.5 mb-2">
                          <div>Tu respuesta: <strong>{userAnswer !== undefined ? q.options[userAnswer] : 'No respondida'}</strong></div>
                          {!isCorrect && (
                            <div className="text-emerald-800 font-medium">
                              Respuesta correcta: <strong>{q.options[q.correctIndex]}</strong>
                            </div>
                          )}
                        </div>

                        <div className="p-2.5 bg-white/80 rounded-lg border border-slate-200 text-slate-700">
                          <strong>Explicación pedagógica: </strong>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
