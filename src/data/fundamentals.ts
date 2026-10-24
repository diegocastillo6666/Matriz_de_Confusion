export interface EducationalConcept {
  id: string;
  title: string;
  shortSummary: string;
  content: string[];
  analogyTitle?: string;
  analogyContent?: string;
  takeaway: string;
}

export const FUNDAMENTAL_CONCEPTS: EducationalConcept[] = [
  {
    id: 'que-es-clasificacion',
    title: '1. ¿Qué es un Modelo de Clasificación en Machine Learning?',
    shortSummary:
      'Un algoritmo supervisado que aprende a asignar una etiqueta o categoría discreta a una nueva observación a partir de patrones históricos.',
    content: [
      'A diferencia de los modelos de regresión (que predicen un número continuo como el precio de una vivienda o la temperatura), los modelos de clasificación deciden a qué categoría o grupo pertenece un dato.',
      'Ejemplos clásicos: ¿Este correo es Spam o No Spam? ¿Esta transacción bancaria es Fraudulenta o Legítima? ¿Este paciente tiene la Enfermedad o está Sano?',
      'Para entrenar el modelo, se le suministran miles de ejemplos donde ya se conoce el resultado real (etiqueta o Ground Truth). El algoritmo aprende a asociar características (features) con esa etiqueta para poder clasificar casos futuros nunca antes vistos.',
    ],
    analogyTitle: 'La analogía del Clasificador Postal',
    analogyContent:
      'Imagina un empleado de correos que mira el código postal de cada carta y la coloca en la bandeja de "Norte", "Sur" o "Internacional". Si pone una carta de Madrid en la bandeja de Tokio, ha cometido un error de clasificación.',
    takeaway:
      'Clasificar es tomar una decisión categórica sobre un dato basándose en probabilidades calculadas.',
  },
  {
    id: 'que-es-matriz-confusion',
    title: '2. ¿Qué es una Matriz de Confusión y para qué sirve?',
    shortSummary:
      'Una tabla de contingencia que enfrenta la realidad contra las predicciones del modelo para desglosar detalladamente los aciertos y tipos de errores.',
    content: [
      'El nombre "Matriz de Confusión" proviene precisamente de su propósito: mostrar claramente si el modelo está "confundiendo" una clase con otra y en qué medida.',
      'En una clasificación binaria (dos clases: Positiva y Negativa), la matriz es una cuadrícula de 2 filas por 2 columnas (4 celdas).',
      'Por convención estándar:',
      '• Filas: Representan el valor REAL o Verdadero (Ground Truth).',
      '• Columnas: Representan el valor PREDICHO por el algoritmo.',
      '• Diagonal Principal (arriba-izq a abajo-der): Representa los ACIERTOS (TP y TN).',
      '• Diagonal Secundaria (arriba-der a abajo-izq): Representa los ERRORES (FN y FP).',
    ],
    analogyTitle: 'El Espejo de la Verdad',
    analogyContent:
      'Un examen médico no solo debe evaluarse por cuántas personas atiende al día, sino por cuántas personas enfermas curó y a cuántas personas sanas asustó por error. La matriz es ese desglose minucioso.',
    takeaway:
      'La matriz no es una sola nota o calificación: es una radiografía completa del comportamiento de tu algoritmo.',
  },
  {
    id: 'los-cuatro-cuadrantes',
    title: '3. Los 4 Cuadrantes: TP, FP, TN y FN',
    shortSummary:
      'La anatomía fundamental de cualquier evaluación binaria. Cada celda tiene un impacto y costo radicalmente distinto.',
    content: [
      '• Verdadero Positivo (TP - True Positive): La realidad era Positiva y el modelo predijo Positivo. ¡Acierto en la clase de interés!',
      '• Falso Positivo (FP - False Positive | Error Tipo I): La realidad era Negativa, pero el modelo predijo Positivo. Es una "Falsa Alarma". El modelo vio un patrón que no existía.',
      '• Falso Negativo (FN - False Negative | Error Tipo II): La realidad era Positiva, pero el modelo predijo Negativo. Es una "Omisión Peligrosa". El modelo dejó escapar un caso real.',
      '• Verdadero Negativo (TN - True Negative): La realidad era Negativa y el modelo predijo Negativo. ¡Acierto al descartar correctamente!',
    ],
    analogyTitle: 'La Alarma Antirrobo de una Joyería',
    analogyContent:
      '• TP: Un ladrón entra y la alarma suena. (Se detiene el robo).\n• FP: Una paloma golpea la ventana y la alarma suena a las 3 AM. (Despierta a los dueños innecesariamente).\n• FN: Un ladrón entra con sigilo y la alarma NO suena. (Robo millonario consumado - ¡Gravísimo!).\n• TN: La calle está tranquila y la alarma permanece en silencio.',
    takeaway:
      'Un acierto no siempre vale lo mismo que otro, y un error puede ser una simple molestia o una catástrofe irreversible.',
  },
  {
    id: 'la-paradoja-del-accuracy',
    title: '4. ¿Por qué el Accuracy (Porcentaje de Aciertos) no es suficiente?',
    shortSummary:
      'El porcentaje global de aciertos es la métrica más popular pero también la más engañosa cuando las clases están desbalanceadas.',
    content: [
      '¿Qué pasaría si te digo que creé un modelo con 99.5% de Accuracy para detectar una enfermedad mortal que afecta a 5 de cada 1,000 personas?',
      'Parece un modelo extraordinario, ¿verdad? Pero imagina cómo fue programado: simplemente dice "USTED ESTÁ SANO" a todo el mundo, sin analizar ningún dato.',
      '• Acertará en las 995 personas sanas (995 TN).',
      '• Fallará en las 5 personas enfermas (5 FN, 0 TP).',
      '• Accuracy = 995 / 1000 = 99.5%.',
      'Sin embargo, ese modelo es COMPLETAMENTE INÚTIL y letal: no salvó a ninguna de las 5 personas enfermas (Recall = 0%).',
      'A esto se le conoce en ciencia de datos como la Paradoja de la Exactitud (Accuracy Paradox). Por eso necesitamos Precision, Recall, Specificity y F1-Score.',
    ],
    analogyTitle: 'El Reloj Parado',
    analogyContent:
      'Un reloj roto que marca siempre las 12:00 tiene una precisión perfecta dos veces al día. Sin embargo, no sirve para saber la hora cuando realmente lo necesitas.',
    takeaway:
      'Nunca evalúes un modelo de clasificación basándote únicamente en su Accuracy, especialmente si la clase de interés es poco frecuente.',
  },
  {
    id: 'clase-positiva-relatividad',
    title: '5. La Importancia de Definir la "Clase Positiva"',
    shortSummary:
      'Las métricas dependen enteramente de qué categoría definas como "positiva". Lo positivo en ML no significa "bueno", sino el evento a detectar.',
    content: [
      'En lenguaje cotidiano, "positivo" suele asociarse a algo alegre o favorable (como una actitud positiva).',
      'En Machine Learning y estadística médica, "Positivo" simplemente significa: "el fenómeno, anomalía o evento que estamos buscando activamente".',
      'Por ejemplo:',
      '• En detección de cáncer: Positivo = Presencia de tumor.',
      '• En ciberseguridad: Positivo = Paquete malicioso o ataque DDoS.',
      '• En telecomunicaciones: Positivo = Cliente que cancelará su contrato.',
      'Si inviertes cuál clase es la positiva y cuál la negativa, los valores de Precision, Recall y F1 se invertirán completamente.',
    ],
    analogyTitle: 'Buscar una aguja en un pajar',
    analogyContent:
      'La aguja es la clase positiva porque es lo que estás buscando, aunque preferirías que no hubiera ninguna aguja en tu comida.',
    takeaway:
      'Declara siempre de forma explícita cuál es la clase positiva antes de calcular o comunicar cualquier métrica de desempeño.',
  },
  {
    id: 'binaria-vs-multiclase',
    title: '6. Clasificación Binaria vs. Clasificación Multiclase',
    shortSummary:
      'Cómo se expande la matriz de 2x2 cuando tenemos 3 o más categorías posibles.',
    content: [
      'En clasificación binaria solo existen 2 opciones (Sí/No, A/B). La matriz siempre es 2×2.',
      'En clasificación multiclase existen N categorías mutuamente excluyentes (por ejemplo: clasificar imágenes en Perro, Gato, Caballo o Pájaro). La matriz resultante es de N×N (4×4 = 16 celdas).',
      'En una matriz multiclase:',
      '• La diagonal principal sigue conteniendo todos los aciertos perfectos (Perro predicho como Perro, Gato como Gato, etc.).',
      '• Cualquier celda fuera de la diagonal es una confusión específica (por ejemplo: predecir Gato cuando en realidad era Perro).',
      '• Para calcular métricas por clase, se utiliza la técnica "One-vs-Rest" (Uno contra el resto): se toma una clase como Positiva y todas las demás combinadas se tratan como Negativa.',
    ],
    analogyTitle: 'El Clasificador de Reciclaje',
    analogyContent:
      'Un contenedor inteligente clasifica residuos en Plástico, Vidrio, Papel u Orgánico (4 clases). Si arrojas una botella de vidrio y la deposita en plástico, la matriz registra la confusión exacta Vidrio->Plástico.',
    takeaway:
      'La matriz multiclase te ayuda a identificar exactamente entre qué pares de categorías se confunde el modelo.',
  },
];
