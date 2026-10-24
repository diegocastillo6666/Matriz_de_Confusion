import { MatrixValues, CalculatedMetrics, MetricResult } from '../types';

export function calculateMetrics(matrix: MatrixValues): CalculatedMetrics {
  const { tp, fp, fn, tn } = matrix;
  const total = tp + fp + fn + tn;
  const actualPositive = tp + fn;
  const actualNegative = fp + tn;
  const predictedPositive = tp + fp;
  const predictedNegative = fn + tn;

  // Safe division helper
  const safeDivide = (
    numerator: number,
    denominator: number,
    name: string,
    zeroMsg: string,
    formula: string,
    desc: string,
    highInterp: string,
    lowInterp: string
  ): MetricResult => {
    if (denominator <= 0) {
      return {
        value: null,
        formatted: 'Indefinido',
        formula,
        description: desc,
        interpretationHigh: highInterp,
        interpretationLow: lowInterp,
        isUndefined: true,
        undefinedReason: zeroMsg,
      };
    }
    const val = numerator / denominator;
    return {
      value: val,
      formatted: `${(val * 100).toFixed(1)}%`,
      formula,
      description: desc,
      interpretationHigh: highInterp,
      interpretationLow: lowInterp,
      isUndefined: false,
    };
  };

  const accuracy = safeDivide(
    tp + tn,
    total,
    'Accuracy (Exactitud)',
    'Total de observaciones es 0.',
    'Accuracy = (TP + TN) / (TP + TN + FP + FN)',
    'Proporción de todas las predicciones correctas (tanto positivas como negativas) respecto al total.',
    'El modelo acierta en la inmensa mayoría de sus clasificaciones globales.',
    'El modelo comete errores frecuentes en el conjunto total de observaciones.'
  );

  const precision = safeDivide(
    tp,
    predictedPositive,
    'Precision (Precisión)',
    'El modelo no realizó ninguna predicción positiva (TP + FP = 0).',
    'Precision = TP / (TP + FP)',
    'De todos los casos que el modelo clasificó como positivos, cuántos eran realmente positivos.',
    'Pocas falsas alarmas. Cuando el modelo dice "Positivo", es altamente confiable.',
    'Muchas falsas alarmas (Falsos Positivos). El modelo alerta en exceso.'
  );

  const recall = safeDivide(
    tp,
    actualPositive,
    'Recall / Sensitivity (Sensibilidad)',
    'No existen casos positivos reales en la muestra (TP + FN = 0).',
    'Recall = TP / (TP + FN)',
    'De todos los casos reales positivos existentes, cuántos logró detectar el modelo.',
    'Pocos casos omitidos. El modelo es excelente encontrando la clase de interés (pocos FN).',
    'Muchos falsos negativos. El modelo deja escapar casos positivos críticos sin detectar.'
  );

  const specificity = safeDivide(
    tn,
    actualNegative,
    'Specificity (Especificidad)',
    'No existen casos negativos reales en la muestra (TN + FP = 0).',
    'Specificity = TN / (TN + FP)',
    'De todos los casos reales negativos existentes, cuántos fueron correctamente descartados.',
    'Excelente capacidad para reconocer los casos sanos/normales y no emitir falsas alarmas.',
    'Dificultad para descartar los casos normales, generando demasiados falsos positivos.'
  );

  // F1-Score calculation
  let f1Result: MetricResult;
  if (precision.isUndefined || recall.isUndefined) {
    f1Result = {
      value: null,
      formatted: 'Indefinido',
      formula: 'F1 = 2 × (Precision × Recall) / (Precision + Recall)',
      description: 'Media armónica entre Precision y Recall. Equilibra ambos compromisos.',
      interpretationHigh: 'Excelente equilibrio entre pocas falsas alarmas y pocos casos omitidos.',
      interpretationLow: 'Uno o ambos componentes (Precision o Recall) están severamente degradados.',
      isUndefined: true,
      undefinedReason: 'Requiere que tanto Precision como Recall estén definidos.',
    };
  } else if ((precision.value ?? 0) + (recall.value ?? 0) === 0) {
    f1Result = {
      value: 0,
      formatted: '0.0%',
      formula: 'F1 = 2 × (Precision × Recall) / (Precision + Recall)',
      description: 'Media armónica entre Precision y Recall. Equilibra ambos compromisos.',
      interpretationHigh: 'Excelente equilibrio entre pocas falsas alarmas y pocos casos omitidos.',
      interpretationLow: 'El modelo no logró ningún Verdadero Positivo efectivo.',
      isUndefined: false,
    };
  } else {
    const p = precision.value!;
    const r = recall.value!;
    const f1 = (2 * p * r) / (p + r);
    f1Result = {
      value: f1,
      formatted: `${(f1 * 100).toFixed(1)}%`,
      formula: 'F1 = 2 × (Precision × Recall) / (Precision + Recall)',
      description: 'Media armónica entre Precision y Recall. Equilibra ambos compromisos.',
      interpretationHigh: 'Excelente equilibrio entre pocas falsas alarmas y pocos casos omitidos.',
      interpretationLow: 'Uno o ambos componentes están bajos; existe un desbalance importante.',
      isUndefined: false,
    };
  }

  const fpr = safeDivide(
    fp,
    actualNegative,
    'False Positive Rate (Tasa de Falsos Positivos)',
    'No existen casos negativos reales (FP + TN = 0).',
    'FPR = FP / (FP + TN)',
    'Porcentaje de casos negativos que fueron incorrectamente clasificados como positivos (1 - Especificidad).',
    'Alta tasa de falsas alarmas sobre la población sana o normal.',
    'Baja tasa de falsas alarmas; casi ningún caso negativo es acusado incorrectamente.'
  );

  const fnr = safeDivide(
    fn,
    actualPositive,
    'False Negative Rate (Tasa de Falsos Negativos)',
    'No existen casos positivos reales (FN + TP = 0).',
    'FNR = FN / (FN + TP)',
    'Porcentaje de casos positivos que el modelo no detectó (1 - Recall). También conocido como Error Tipo II.',
    'Grave omisión de casos positivos reales; el modelo es peligroso en tareas críticas.',
    'Excelente cobertura; casi ningún caso positivo pasa inadvertido.'
  );

  const prevalence = safeDivide(
    actualPositive,
    total,
    'Prevalencia de la Clase Positiva',
    'El conjunto de datos está vacío.',
    'Prevalencia = (TP + FN) / Total',
    'Frecuencia relativa con la que ocurre la clase positiva en la población estudiada.',
    'La clase positiva es común en los datos.',
    'Clase positiva poco frecuente (datos desbalanceados).'
  );

  return {
    total,
    actualPositive,
    actualNegative,
    predictedPositive,
    predictedNegative,
    accuracy,
    precision,
    recall,
    specificity,
    f1Score: f1Result,
    fpr,
    fnr,
    prevalence,
  };
}

// Normalized matrix percentages helper
export function getNormalizedMatrix(matrix: MatrixValues, mode: 'total' | 'actual' | 'predicted' = 'total') {
  const { tp, fp, fn, tn } = matrix;
  const total = tp + fp + fn + tn;
  const actualPositive = tp + fn;
  const actualNegative = fp + tn;
  const predPositive = tp + fp;
  const predNegative = fn + tn;

  if (mode === 'total') {
    if (total === 0) return { tp: '0%', fp: '0%', fn: '0%', tn: '0%' };
    return {
      tp: `${((tp / total) * 100).toFixed(1)}%`,
      fp: `${((fp / total) * 100).toFixed(1)}%`,
      fn: `${((fn / total) * 100).toFixed(1)}%`,
      tn: `${((tn / total) * 100).toFixed(1)}%`,
    };
  }

  if (mode === 'actual') {
    return {
      tp: actualPositive > 0 ? `${((tp / actualPositive) * 100).toFixed(1)}%` : '0%',
      fn: actualPositive > 0 ? `${((fn / actualPositive) * 100).toFixed(1)}%` : '0%',
      fp: actualNegative > 0 ? `${((fp / actualNegative) * 100).toFixed(1)}%` : '0%',
      tn: actualNegative > 0 ? `${((tn / actualNegative) * 100).toFixed(1)}%` : '0%',
    };
  }

  // mode === 'predicted'
  return {
    tp: predPositive > 0 ? `${((tp / predPositive) * 100).toFixed(1)}%` : '0%',
    fp: predPositive > 0 ? `${((fp / predPositive) * 100).toFixed(1)}%` : '0%',
    fn: predNegative > 0 ? `${((fn / predNegative) * 100).toFixed(1)}%` : '0%',
    tn: predNegative > 0 ? `${((tn / predNegative) * 100).toFixed(1)}%` : '0%',
  };
}

// Detect if an accuracy paradox is present
export function detectAccuracyParadox(matrix: MatrixValues): { hasParadox: boolean; explanation: string } {
  const metrics = calculateMetrics(matrix);
  if (metrics.total === 0) return { hasParadox: false, explanation: '' };

  const acc = metrics.accuracy.value ?? 0;
  const rec = metrics.recall.value ?? 0;
  const prec = metrics.precision.value ?? 0;
  const prev = metrics.prevalence.value ?? 0;

  // Imbalanced data with high accuracy but poor recall or precision
  if (prev < 0.15 && acc >= 0.85 && rec < 0.40) {
    return {
      hasParadox: true,
      explanation: `⚠️ ¡Paradoja del Accuracy detectada! Aunque la Exactitud parece muy alta (${metrics.accuracy.formatted}), se debe principalmente a que el 85%+ de la población es negativa. En realidad, el modelo deja escapar el ${( (1 - rec) * 100 ).toFixed(1)}% de los casos positivos reales (Recall de solo ${metrics.recall.formatted}). Un modelo trivial que predijera "negativo" a todos tendría un Accuracy similar pero utilidad cero.`,
    };
  }

  if (acc >= 0.80 && prec < 0.35 && (metrics.predictedPositive > 0)) {
    return {
      hasParadox: true,
      explanation: `⚠️ ¡Alerta de baja precisión a pesar de alta exactitud! El Accuracy es del ${metrics.accuracy.formatted}, pero la Precisión es solo del ${metrics.precision.formatted}. Esto significa que la gran mayoría de las alarmas positivas que genera el modelo son falsas, saturando al equipo humano.`,
    };
  }

  return { hasParadox: false, explanation: '' };
}
