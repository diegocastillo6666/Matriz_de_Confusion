import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Lightbulb,
  Brain,
  Bot,
  User,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { SectorCase, MatrixValues } from '../types';
import { calculateMetrics } from '../utils/metrics';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  source?: string;
  timestamp: string;
}

interface Module7Props {
  currentSector: SectorCase;
  currentMatrix: MatrixValues;
}

export const Module7AiTutor: React.FC<Module7Props> = ({
  currentSector,
  currentMatrix,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `¡Hola! Soy tu **Tutor Pedagógico de Machine Learning**. 
Puedo ayudarte a interpretar cualquier matriz de confusión, explicarte métricas complejas mediante analogías cotidianas, o recomendarte qué umbral de decisión conviene a tu empresa.

¿Qué te gustaría explorar hoy?`,
      source: 'gemini_3_8_flash',
      timestamp: 'Ahora',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const metrics = calculateMetrics(currentMatrix);

  const quickPrompts = [
    {
      label: '💡 Analogía de Precision vs Recall',
      prompt: 'Explícame la diferencia entre Precision y Recall con una analogía cotidiana sencilla.',
    },
    {
      label: '⚠️ ¿Por qué 99% de Accuracy es engañoso?',
      prompt: 'Explícame en palabras sencillas por qué tener 99% de Accuracy puede ser peligroso si los datos están desbalanceados.',
    },
    {
      label: '🔍 Interpreta mi matriz actual',
      prompt: `Analiza e interpreta mi matriz de confusión actual: TP=${currentMatrix.tp}, FP=${currentMatrix.fp}, FN=${currentMatrix.fn}, TN=${currentMatrix.tn} en el sector ${currentSector.name}. ¿Qué conclusiones de negocio extraes?`,
    },
    {
      label: '⚖️ ¿Cómo calibrar el umbral de decisión?',
      prompt: '¿Cómo afecta mover el umbral de probabilidad (threshold) a los Falsos Positivos y Falsos Negativos?',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          context: {
            sectorName: currentSector.name,
            positiveClass: currentSector.positiveClass,
            tp: currentMatrix.tp,
            fp: currentMatrix.fp,
            fn: currentMatrix.fn,
            tn: currentMatrix.tn,
            accuracy: metrics.accuracy.formatted,
            precision: metrics.precision.formatted,
            recall: metrics.recall.formatted,
            f1: metrics.f1Score.formatted,
          },
        }),
      });

      const data = await response.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.response || 'No se pudo generar una respuesta.',
        source: data.source || 'pedagogical_engine',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `Hubo una pequeña interrupción en la conexión, pero aquí tienes una regla de oro pedagógica:
- Recuerda que la **Precision** te protege de acusar o alertar a quien no corresponde (evita Falsos Positivos).
- El **Recall** te protege de dejar escapar al culpable o al paciente enfermo (evita Falsos Negativos).
En el sector de **${currentSector.name}**, debes evaluar siempre cuál de los dos errores le cuesta más dinero o riesgo vital a la organización.`,
        source: 'pedagogical_local',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-200 text-purple-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Módulo 7 • Tutor Pedagógico con Inteligencia Artificial
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Asistente Educativo de Machine Learning
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Conectado a los modelos de Gemini y enriquecido con el contexto en tiempo real de tu matriz actual
              ({currentSector.name} • TP: {currentMatrix.tp}, FP: {currentMatrix.fp}, FN: {currentMatrix.fn}, TN:{' '}
              {currentMatrix.tn}).
            </p>
          </div>
        </div>

        {/* Quick prompt suggestions */}
        <div className="mt-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Preguntas Rápidas Sugeridas:
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                disabled={isLoading}
                onClick={() => handleSendMessage(qp.prompt)}
                className="text-xs font-semibold px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-700 rounded-xl transition"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs space-y-2'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div
                    className={`text-[10px] mt-1 flex items-center justify-between ${
                      isUser ? 'text-slate-400' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.source && (
                      <span className="font-mono text-[9px] bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-600">
                        {msg.source === 'gemini_3_8_flash' ? 'Gemini 3.8 Flash' : 'Motor Pedagógico'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-11">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
              <span>El Profesor Turing está analizando y redactando la explicación...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Haz una pregunta sobre métricas, pide una analogía o analiza un caso..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
