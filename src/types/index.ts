export interface MatrixValues {
  tp: number; // Verdaderos Positivos
  fp: number; // Falsos Positivos
  fn: number; // Falsos Negativos
  tn: number; // Verdaderos Negativos
}

export interface MetricResult {
  value: number | null; // null if division by zero
  formatted: string;
  formula: string;
  description: string;
  interpretationHigh: string;
  interpretationLow: string;
  isUndefined: boolean;
  undefinedReason?: string;
}

export interface CalculatedMetrics {
  total: number;
  actualPositive: number;
  actualNegative: number;
  predictedPositive: number;
  predictedNegative: number;
  accuracy: MetricResult;
  precision: MetricResult;
  recall: MetricResult;
  specificity: MetricResult;
  f1Score: MetricResult;
  fpr: MetricResult; // False Positive Rate
  fnr: MetricResult; // False Negative Rate
  prevalence: MetricResult;
}

export interface SectorCase {
  id: string;
  name: string;
  sectorName: string;
  icon: string;
  tagline: string;
  businessProblem: string;
  modelObjective: string;
  positiveClass: string;
  negativeClass: string;
  positiveDefinition: string;
  negativeDefinition: string;
  defaultMatrix: MatrixValues;
  tpDescription: string;
  fpDescription: string;
  fnDescription: string;
  tnDescription: string;
  tpConcreteExample: string;
  fpConcreteExample: string;
  fnConcreteExample: string;
  tnConcreteExample: string;
  criticalMetrics: {
    metric: string;
    priority: 'Alta' | 'Media' | 'Crítica';
    reason: string;
  }[];
  businessRecommendations: string[];
  disclaimer?: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: string;
}

export interface GamificationState {
  xp: number;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  completedModules: string[];
  solvedSectorQuizzes: string[];
  solvedChallenges: string[];
  badges: Badge[];
  finalExamScore: number | null;
  finalExamCompleted: boolean;
  streak: number;
}

export interface ChallengeQuestion {
  id: string;
  category: 'identificacion' | 'metrica_optima' | 'ciego';
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  matrixData?: MatrixValues;
  xpReward: number;
}

export interface FinalExamQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}
