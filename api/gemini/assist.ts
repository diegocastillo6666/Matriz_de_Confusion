import { GoogleGenAI } from '@google/genai';

// Vercel Serverless Function handler for POST /api/gemini/assist
export default async function handler(req: any, res: any) {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { prompt, context } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is not configured or is placeholder, return pedagogical engine response
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      const fallbackResponse = generatePedagogicalFallback(prompt, context);
      return res.status(200).json({
        response: fallbackResponse,
        source: 'pedagogical_engine',
        isAiGenerated: false,
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `
Eres el "Profesor Turing", un tutor pedagógico y experto en Machine Learning y Ciencia de Datos especializado en la Matriz de Confusión y evaluación de modelos de clasificación.
Tu misión es educar con claridad, rigor matemático y empatía pedagógica a estudiantes de ciencia de datos.
Reglas:
1. Explica conceptos complejos usando analogías cotidianas e intuitivas.
2. Si el usuario te proporciona valores de TP, FP, TN, FN o un sector empresarial, basa tus cálculos y análisis estrictamente en esos números (no inventes datos).
3. Enfatiza siempre el costo de los errores (Falsos Positivos vs Falsos Negativos) en el contexto de negocio concreto.
4. Responde en español de forma amigable, estructurada y concisa.
5. Usa viñetas claras y resalta términos clave.
`;

    const userMessage = context
      ? `[Contexto actual del usuario]:
Sector / Escenario: ${context.sectorName || 'General'}
Clase Positiva definida: ${context.positiveClass || 'Positivo'}
Valores de Matriz: TP=${context.tp ?? 'N/A'}, FP=${context.fp ?? 'N/A'}, FN=${context.fn ?? 'N/A'}, TN=${context.tn ?? 'N/A'}
Métricas actuales: Accuracy=${context.accuracy ?? 'N/A'}, Precision=${context.precision ?? 'N/A'}, Recall=${context.recall ?? 'N/A'}, F1=${context.f1 ?? 'N/A'}

[Pregunta del estudiante]:
${prompt}`
      : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.status(200).json({
      response: response.text || 'No se pudo generar una respuesta.',
      source: 'gemini_3_8_flash',
      isAiGenerated: true,
    });
  } catch (error: any) {
    console.error('Error en /api/gemini/assist:', error);
    const fallbackResponse = generatePedagogicalFallback(req.body?.prompt, req.body?.context);
    return res.status(200).json({
      response: fallbackResponse,
      source: 'pedagogical_fallback',
      isAiGenerated: false,
      note: 'Generado con el motor educativo integrado.',
    });
  }
}

function generatePedagogicalFallback(prompt: string, context?: any): string {
  const p = (prompt || '').toLowerCase();

  if (p.includes('analog') || p.includes('ejemplo cotidiano') || p.includes('alarma')) {
    return `### 💡 Analogía de la Alarma de Incendios:
- **Verdadero Positivo (TP):** Hay fuego real y la alarma suena. ¡Excelente! Todos evacuan a tiempo.
- **Verdadero Negativo (TN):** No hay fuego y la alarma está en silencio. Todo en paz.
- **Falso Positivo (FP) - Error Tipo I:** Alguien quemó una tostada o hay polvo; la alarma suena sin haber fuego real. Costo: molestia, evacuación innecesaria, pérdida de tiempo.
- **Falso Negativo (FN) - Error Tipo II:** ¡Hay un incendio real pero la alarma no suena! Costo: catastrófico, vidas en peligro.

Por eso, en sistemas críticos (como salud o detección de incendios), preferimos tolerar algunos Falsos Positivos con tal de reducir al mínimo los Falsos Negativos (buscamos un **Recall** muy alto).`;
  }

  if (p.includes('precision') || p.includes('precisión')) {
    return `### 🎯 ¿Qué es la Precisión (Precision)?
Fórmula: **TP / (TP + FP)**
Responde a la pregunta: *"De todas las veces que el modelo predijo positivo, ¿cuántas acertó en la realidad?"*
- **Alta precisión:** Cuando el modelo da una alarma o predicción positiva, puedes confiar plenamente en que es verdad.
- **Cuándo priorizarla:** Cuando el costo de un Falso Positivo es muy alto (por ejemplo, acusar a alguien erróneamente de fraude o enviar un cupón de 100 USD muy costoso a quien no comprará).`;
  }

  if (p.includes('recall') || p.includes('sensibilidad')) {
    return `### 🔍 ¿Qué es el Recall o Sensibilidad?
Fórmula: **TP / (TP + FN)**
Responde a la pregunta: *"De todos los casos que realmente eran positivos en el mundo real, ¿qué porcentaje logró capturar el modelo?"*
- **Alto Recall:** El modelo es como una red de pesca fina; casi nada se le escapa.
- **Cuándo priorizarla:** Cuando el costo de un Falso Negativo es letal o inaceptable (diagnóstico de enfermedades graves, detección de transacciones fraudulentas, piezas defectuosas en aviación).`;
  }

  if (p.includes('paradoja') || p.includes('accuracy') || p.includes('exactitud')) {
    return `### ⚠️ La Paradoja de la Exactitud (Accuracy Paradox):
Supongamos que analizamos una enfermedad rara presente en solo el 1% de la población (10 de 1,000 personas).
Si construimos un modelo "tramposo" que siempre predice "SANO" para todo el mundo:
- Acertará en 990 personas sanas (TN = 990).
- Fallará en los 10 enfermos (FN = 10, TP = 0).
- **Accuracy = 99%** (¡Parece casi perfecto!).
- Pero su **Recall = 0%** (¡No detectó a ningún enfermo!).

Por esta razón, en datos desbalanceados, el Accuracy es engañoso y debemos recurrir a Precision, Recall y F1-Score.`;
  }

  if (p.includes('f1') || p.includes('f1-score')) {
    return `### ⚖️ ¿Qué es el F1-Score?
Fórmula: **2 × (Precision × Recall) / (Precision + Recall)**
Es la media armónica entre Precision y Recall.
- Castiga duramente los valores extremos: si la Precision es 90% pero el Recall es 10%, el F1-score se hunde a ~18%.
- Es la métrica ideal cuando necesitas un balance saludable entre evitar falsas alarmas (FP) y no dejar escapar positivos reales (FN).`;
  }

  if (context && context.tp !== undefined) {
    return `### 📊 Análisis de tu Matriz Actual:
- **TP (Verdaderos Positivos):** ${context.tp} casos positivos detectados con éxito.
- **FP (Falsos Positivos):** ${context.fp} falsas alarmas.
- **FN (Falsos Negativos):** ${context.fn} casos positivos que el modelo dejó escapar.
- **TN (Verdaderos Negativos):** ${context.tn} casos negativos identificados correctamente.

En el sector de **${context.sectorName || 'tu problema'}**, ${
      context.fn > context.fp
        ? 'el modelo tiene una tasa de Falsos Negativos superior a las falsas alarmas. Si los casos positivos omitidos generan alto riesgo o pérdida, considera ajustar el umbral de decisión (threshold) hacia la izquierda para incrementar el Recall.'
        : 'el modelo está priorizando no cometer falsos negativos, lo cual puede generar falsas alarmas (FP). Revisa si la operación puede soportar el costo de revisar esos casos adicionales.'
    }`;
  }

  return `### 🎓 Concepto clave de la Matriz de Confusión:
La matriz de confusión no es solo una tabla 2×2: es la brújula para entender los **compromisos (trade-offs)** de cualquier modelo de Machine Learning en producción.
- Las filas representan la **Realidad** (Ground Truth).
- Las columnas representan la **Predicción** del algoritmo.
- Los aciertos están en la diagonal principal (TP y TN).
- Los errores están en la diagonal secundaria (FP y FN).`;
}
