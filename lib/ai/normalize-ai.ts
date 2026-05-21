import type { AiReputationResult, AiSentimentResult } from "./types";
import type { SentimentLabel } from "@prisma/client";

export function normalizeSentimentLabel(label: string): SentimentLabel {
  const normalized = label.toUpperCase().replace(/\s+/g, "_");
  const valid: SentimentLabel[] = [
    "VERY_NEGATIVE",
    "NEGATIVE",
    "NEUTRAL",
    "POSITIVE",
    "VERY_POSITIVE",
  ];
  return valid.includes(normalized as SentimentLabel)
    ? (normalized as SentimentLabel)
    : "NEUTRAL";
}

export function clampScore(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function normalizeReputationScores(
  result: AiReputationResult
): AiReputationResult {
  return {
    ...result,
    reputationScore: clampScore(result.reputationScore, 1, 5),
    cultureScore: clampScore(result.cultureScore, 1, 5),
    hiringScore: clampScore(result.hiringScore, 1, 5),
    compensationScore: clampScore(result.compensationScore, 1, 5),
    workLifeScore: clampScore(result.workLifeScore, 1, 5),
    leadershipScore: clampScore(result.leadershipScore, 1, 5),
    toxicityScore: clampScore(result.toxicityScore, 0, 5),
    engineeringScore: clampScore(result.engineeringScore, 1, 5),
    growthScore: clampScore(result.growthScore, 1, 5),
    confidence: clampScore(result.confidence, 0, 1),
  };
}

export function normalizeSentimentResult(
  result: AiSentimentResult
): AiSentimentResult {
  return {
    ...result,
    overallScore: clampScore(result.overallScore, -1, 1),
    positiveRatio: clampScore(result.positiveRatio, 0, 1),
    negativeRatio: clampScore(result.negativeRatio, 0, 1),
    neutralRatio: clampScore(result.neutralRatio, 0, 1),
  };
}
