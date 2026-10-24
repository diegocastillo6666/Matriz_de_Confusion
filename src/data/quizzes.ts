import { ChallengeQuestion, FinalExamQuestion, Badge } from '../types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'primer-paso',
    title: 'Primeros Pasos en ML',
    description: 'Completaste la lectura del Módulo 1 de Fundamentos.',
    icon: 'BookOpen',
    unlocked: false,
    requirement: 'Revisar todos los fundamentos teóricos.',
  },
  {
    id: 'explorador-matriz',
    title: 'Explorador de la Matriz',
    description: 'Interactuaste con las 4 celdas de la matriz interactiva.',
    icon: 'Grid',
    unlocked: false,
    requirement: 'Hacer clic e inspeccionar TP, FP, TN y FN en la matriz.',
  },
  {
    id: 'laboratorista-metrica',
    title: 'Maestro de Métricas',
    description: 'Modificaste los sliders en el laboratorio para simular diferentes escenarios.',
    icon: 'Sliders',
    unlocked: false,
    requirement: 'Experimentar con valores personalizados en el laboratorio.',
  },
  {
    id: 'cazador-fraude',
    title: 'Cazador de Fraudes',
    description: 'Comprendiste el impacto crítico del Recall en el sector bancario.',
    icon: 'ShieldCheck',
    unlocked: false,
    requirement: 'Responder correctamente el cuestionario de Banca.',
  },
  {
    id: 'guardian-salud',
    title: 'Guardián Clínico',
    description: 'Dominaste el rol de la Sensibilidad en salud preventiva.',
    icon: 'HeartPulse',
    unlocked: false,
    requirement: 'Resolver el caso práctico del sector Salud.',
  },
  {
    id: 'estratega-negocio',
    title: 'Estratega de Negocio',
    description: 'Comparaste dos modelos y tomaste la decisión basada en objetivos empresariales.',
    icon: 'TrendingUp',
    unlocked: false,
    requirement: 'Realizar una comparación de modelos en el Módulo 6.',
  },
  {
    id: 'graduado-honores',
    title: 'Científico de Datos Graduado',
    description: 'Aprobaste el Examen Final de la Matriz de Confusión con más del 80%.',
    icon: 'Award',
    unlocked: false,
    requirement: 'Obtener al menos 8/10 en el Examen Final.',
  },
];

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  // Nivel Principiante: Identificación de cuadrantes
  {
    id: 'reto-1',
    category: 'identificacion',
    difficulty: 'Principiante',
    title: 'El Filtro de Correo Spam',
    scenario:
      'Un sistema antispam analiza un correo electrónico importante con la confirmación de una entrevista de trabajo. El filtro lo marca erróneamente como correo no deseado y lo envía a la carpeta de basura.',
    question: 'Desde el punto de vista del detector de Spam (Clase Positiva = Spam), ¿qué tipo de resultado es este?',
    options: [
      'Verdadero Positivo (TP)',
      'Falso Positivo (FP)',
      'Falso Negativo (FN)',
      'Verdadero Negativo (TN)',
    ],
    correctIndex: 1,
    explanation:
      '¡Correcto! El correo era legítimo (Negativo), pero el modelo predijo que era Spam (Positivo). Es una falsa alarma, es decir, un Falso Positivo (FP).',
    xpReward: 30,
  },
  {
    id: 'reto-2',
    category: 'identificacion',
    difficulty: 'Principiante',
    title: 'El Detector de Metales del Aeropuerto',
    scenario:
      'Un pasajero pasa por el arco de seguridad del aeropuerto llevando únicamente un cinturón con hebilla de plástico. La alarma del detector NO suena y el pasajero continúa hacia su puerta de embarque.',
    question: 'Si la Clase Positiva es "Objeto Peligroso Metálico Detectado", ¿qué ocurrió en este evento?',
    options: [
      'Verdadero Positivo (TP)',
      'Falso Positivo (FP)',
      'Falso Negativo (FN)',
      'Verdadero Negativo (TN)',
    ],
    correctIndex: 3,
    explanation:
      '¡Muy bien! El pasajero no llevaba ningún metal peligroso (Negativo real) y el arco no sonó (Predicción negativa). Es un Verdadero Negativo (TN).',
    xpReward: 30,
  },

  // Nivel Intermedio: Métrica óptima para el negocio
  {
    id: 'reto-3',
    category: 'metrica_optima',
    difficulty: 'Intermedio',
    title: 'Lanzamiento de Préstamos Preaprobados de Alto Valor',
    scenario:
      'Un banco lanzará una campaña de préstamos de 50,000 USD. Por cada préstamo otorgado a un cliente moroso, el banco pierde 50,000 USD íntegros. El costo de enviar la oferta es irrelevante.',
    question: 'Si la Clase Positiva es "Cliente Moroso / Impago", ¿qué métrica debe exigir la junta directiva que sea máxima?',
    options: [
      'Recall (Sensibilidad) de Morosidad',
      'Accuracy global',
      'Tasa de Falsos Positivos',
      'Prevalencia',
    ],
    correctIndex: 0,
    explanation:
      '¡Exacto! El banco quiere evitar a toda costa prestarle dinero a un moroso (Falso Negativo). Maximizar el Recall de los morosos garantiza que casi ningún cliente insolvente pase el filtro sin ser detectado.',
    xpReward: 40,
  },
  {
    id: 'reto-4',
    category: 'metrica_optima',
    difficulty: 'Intermedio',
    title: 'Notificaciones Push de Ofertas Flash en App Móvil',
    scenario:
      'Una aplicación móvil envía notificaciones push a sus usuarios. Los estudios indican que si un usuario recibe 2 notificaciones que no le interesan en una semana, desinstala la aplicación.',
    question: 'Para el modelo que predice si al usuario le interesará la oferta (Clase Positiva = Le Interesa), ¿qué métrica debe priorizarse para no saturar al usuario?',
    options: [
      'Recall',
      'Precision (Precisión)',
      'Tasa de Falsos Negativos (FNR)',
      'Número total de predicciones',
    ],
    correctIndex: 1,
    explanation:
      '¡Correcto! Una alta Precision asegura que cuando el modelo decida enviar una notificación (Predicción Positiva), casi con certeza sea de interés del usuario, evitando Falsos Positivos que provoquen la desinstalación de la app.',
    xpReward: 40,
  },

  // Nivel Avanzado: Reto de matriz a ciegas
  {
    id: 'reto-5',
    category: 'ciego',
    difficulty: 'Avanzado',
    title: 'Auditoría a Ciegas: El Algoritmo Sospechoso',
    scenario:
      'Un proveedor de software te presenta un modelo con los siguientes datos en un conjunto de prueba de 1,000 clientes:\nTP = 5, FP = 5, FN = 95, TN = 895.',
    question: 'El vendedor afirma con orgullo que su algoritmo tiene "un impresionante 90% de Exactitud (Accuracy)". ¿Cuál es la realidad de este modelo?',
    options: [
      'El modelo es excelente y debe implementarse de inmediato.',
      'Hay una trampa de desbalance: aunque el Accuracy es 90%, el Recall es de apenas 5% (deja escapar el 95% de los casos reales).',
      'El modelo tiene un F1-score del 90%.',
      'El modelo tiene una Especificidad del 5%.',
    ],
    correctIndex: 1,
    explanation:
      '¡Brillante análisis! Accuracy = (5 + 895) / 1000 = 90%. Pero de los 100 casos positivos reales (5 + 95), ¡solo detectó 5! Recall = 5 / 100 = 5%. Es un ejemplo clásico de la Paradoja del Accuracy en datos desbalanceados.',
    matrixData: {
      tp: 5,
      fp: 5,
      fn: 95,
      tn: 895,
    },
    xpReward: 50,
  },
  {
    id: 'reto-6',
    category: 'ciego',
    difficulty: 'Avanzado',
    title: 'El Trade-Off del Umbral de Probabilidad',
    scenario:
      'Un modelo de clasificación asigna probabilidades continuas entre 0.0 y 1.0. Decides mover el umbral de decisión de 0.50 a 0.20 (ahora se predice Positivo con mucha más facilidad).',
    question: '¿Qué efecto previsible tendrá este cambio en las métricas de la matriz?',
    options: [
      'El Recall aumentará (menos FN), pero la Precision tenderá a bajar (más FP).',
      'La Precision aumentará y el Recall disminuirá.',
      'Tanto el Recall como la Precision subirán simultáneamente al 100%.',
      'No habrá ningún cambio en la matriz de confusión.',
    ],
    correctIndex: 0,
    explanation:
      '¡Perfecto! Al bajar el umbral a 0.20, el modelo se vuelve más "sensible" y clasifica más casos como positivos. Disminuyen las omisiones (FN baja -> Recall sube), pero aumentan las falsas alarmas (FP sube -> Precision baja). Es el clásico trade-off de clasificación.',
    xpReward: 50,
  },
];

export const FINAL_EXAM_QUESTIONS: FinalExamQuestion[] = [
  {
    id: 1,
    question: '¿Qué representan las celdas ubicadas en la DIAGONAL PRINCIPAL de una matriz de confusión binaria estándar?',
    options: [
      'Todos los errores cometidos por el algoritmo.',
      'Los aciertos de predicción: Verdaderos Positivos (TP) y Verdaderos Negativos (TN).',
      'Únicamente los casos donde la clase real era positiva.',
      'Las predicciones que requirieron intervención humana.',
    ],
    correctIndex: 1,
    explanation:
      'La diagonal principal (arriba-izquierda a abajo-derecha) contiene siempre los aciertos del modelo: cuando la predicción coincidió con la realidad.',
    topic: 'Fundamentos de la Matriz',
  },
  {
    id: 2,
    question: '¿Cuál es la fórmula matemática exacta de la Precisión (Precision)?',
    options: [
      'TP / (TP + TN)',
      'TP / (TP + FP)',
      'TP / (TP + FN)',
      '(TP + TN) / Total',
    ],
    correctIndex: 1,
    explanation:
      'Precision = TP / (TP + FP). Mide qué proporción de las predicciones positivas hechas por el modelo fueron realmente correctas.',
    topic: 'Fórmulas y Métricas',
  },
  {
    id: 3,
    question: '¿Cuál es la diferencia fundamental entre Recall (Sensibilidad) y Precision (Precisión)?',
    options: [
      'Son exactamente la misma métrica calculada con nombres distintos en medicina y finanzas.',
      'Recall evalúa respecto al total de casos reales positivos (TP+FN); Precision evalúa respecto al total de predicciones positivas (TP+FP).',
      'Recall mide los verdaderos negativos y Precision mide los verdaderos positivos.',
      'Precision siempre es mayor que el Recall en cualquier modelo.',
    ],
    correctIndex: 1,
    explanation:
      'El denominador es la clave: Recall se divide entre todos los positivos de la realidad (TP+FN), mientras que Precision se divide entre todas las alertas dadas por el modelo (TP+FP).',
    topic: 'Interpretación de Métricas',
  },
  {
    id: 4,
    question: 'En un test de detección de virus contagioso en un aeropuerto, ¿cuál es el error más peligroso para la salud pública?',
    options: [
      'Falso Positivo (hacer esperar a una persona sana mientras se le repite el test).',
      'Falso Negativo (dejar subir al avión a una persona contagiada creyendo que está sana).',
      'Verdadero Positivo.',
      'Verdadero Negativo.',
    ],
    correctIndex: 1,
    explanation:
      'Un Falso Negativo (FN) deja libre al vector de contagio, pudiendo infectar a cientos de pasajeros en el vuelo. En salud crítica, los FN son los más letales.',
    topic: 'Aplicación en Salud',
  },
  {
    id: 5,
    question: '¿Por qué se utiliza la MEDIA ARMÓNICA en el F1-Score en lugar de la media aritmética tradicional?',
    options: [
      'Porque la media aritmética es más difícil de programar en Python.',
      'Porque la media armónica penaliza fuertemente si una de las dos métricas (Precision o Recall) es muy baja.',
      'Porque la media armónica siempre da un resultado superior al 95%.',
      'Porque la media aritmética no puede procesar porcentajes.',
    ],
    correctIndex: 1,
    explanation:
      'Si tienes Precision 100% pero Recall 0%, la media aritmética sería 50% (lo cual parecería aceptable), mientras que la media armónica (F1) es 0%, reflejando con rigor que el modelo no funciona.',
    topic: 'Fórmulas y Métricas',
  },
  {
    id: 6,
    question: '¿Qué ocurre con la Especificidad (Specificity) si los Falsos Positivos (FP) aumentan mientras los TN permanecen iguales?',
    options: [
      'La Especificidad aumenta.',
      'La Especificidad disminuye, ya que TN / (TN + FP) tendrá un denominador más grande.',
      'La Especificidad se mantiene inalterada.',
      'La Especificidad se vuelve automáticamente igual al Accuracy.',
    ],
    correctIndex: 1,
    explanation:
      'Especificidad = TN / (TN + FP). Si FP aumenta, el denominador crece y por lo tanto el valor de la especificidad se reduce.',
    topic: 'Cálculos de la Matriz',
  },
  {
    id: 7,
    question: '¿En cuál de los siguientes escenarios es preferible priorizar una ALTA PRECISIÓN antes que un alto Recall?',
    options: [
      'Detección de sismos y tsunamis en costas pobladas.',
      'Detección de cáncer en etapa temprana.',
      'Asignación automática de multas de 10,000 USD a conductores por exceso de velocidad mediante cámaras sin revisión manual.',
      'Filtro de seguridad en una planta nuclear.',
    ],
    correctIndex: 2,
    explanation:
      'Cobrar automáticamente una sanción económica severa sin revisión humana exige una precisión extrema (cero falsas alarmas), ya que multar a un conductor inocente acarrearía demandas graves.',
    topic: 'Decisiones Empresariales',
  },
  {
    id: 8,
    question: 'En un modelo de detección de piezas defectuosas en una fábrica, si TP=90, FP=10, FN=10 y TN=890, ¿cuál es el Accuracy?',
    options: [
      '80.0%',
      '90.0%',
      '98.0%',
      '99.5%',
    ],
    correctIndex: 2,
    explanation:
      'Total = 90 + 10 + 10 + 890 = 1,000. Aciertos = TP + TN = 90 + 890 = 980. Accuracy = 980 / 1000 = 0.98 (98.0%).',
    topic: 'Cálculos de la Matriz',
  },
  {
    id: 9,
    question: '¿Qué representa la Tasa de Falsos Positivos (False Positive Rate - FPR)?',
    options: [
      'La proporción de casos negativos reales que fueron clasificados erróneamente como positivos: FP / (FP + TN).',
      'La proporción de todos los errores respecto al total.',
      'El porcentaje de positivos detectados correctamente.',
      'La inversa matemática del Accuracy.',
    ],
    correctIndex: 0,
    explanation:
      'FPR = FP / (FP + TN) = 1 - Especificidad. Mide qué porcentaje de los casos que eran negativos resultaron ser falsas alarmas.',
    topic: 'Fórmulas y Métricas',
  },
  {
    id: 10,
    question: '¿Qué sucede si invertimos la definición de la clase positiva (por ejemplo, definir "Sano" como positivo y "Enfermo" como negativo)?',
    options: [
      'El Accuracy cambia drásticamente.',
      'El número de observaciones totales se duplica.',
      'El Accuracy global se mantiene idéntico, pero la Precision y el Recall se recalculan con respecto a la nueva clase de interés.',
      'La matriz deja de ser válida matemáticamente.',
    ],
    correctIndex: 2,
    explanation:
      'El Accuracy solo suma la diagonal (TP+TN)/Total, por lo que no cambia. Pero la Precision y el Recall ahora medirán la capacidad de predecir a los sanos en vez de a los enfermos.',
    topic: 'Interpretación de Métricas',
  },
];
