export interface AiSummaryResult {
  title: string;
  summary: string;
  pros: string[];
  cons: string[];
  highlights: string[];
  confidence: number;
}

export interface AiSentimentResult {
  overallScore: number;
  label: string;
  positiveRatio: number;
  negativeRatio: number;
  neutralRatio: number;
  themes: string[];
  sampleSize: number;
}

export interface AiReputationResult {
  reputationScore: number;
  cultureScore: number;
  hiringScore: number;
  compensationScore: number;
  workLifeScore: number;
  leadershipScore: number;
  toxicityScore: number;
  engineeringScore: number;
  growthScore: number;
  confidence: number;
  factors: string[];
  summary: string;
}

export interface AiWorkplaceResult {
  cultureInsights: string[];
  engineeringCulture: string[];
  hiringSentiment: string[];
  managementStyle: string[];
  compensationNotes: string[];
  workLifeBalance: string[];
  diversityInclusion: string[];
  summary: string;
}

export interface AiToxicityResult {
  toxicityScore: number;
  indicators: string[];
  severity: "low" | "medium" | "high";
  examples: string[];
  summary: string;
}

export interface GeminiJsonResponse<T> {
  data: T;
  rawText: string;
}
