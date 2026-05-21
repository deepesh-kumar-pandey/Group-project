import type { AiReputationResult } from "@/lib/ai/types";

export interface CompositeScore {
  overall: number;
  breakdown: Record<string, number>;
  grade: string;
}

export function computeCompositeScore(
  reputation: AiReputationResult
): CompositeScore {
  const weights = {
    reputation: 0.25,
    culture: 0.15,
    hiring: 0.1,
    compensation: 0.1,
    workLife: 0.15,
    leadership: 0.1,
    engineering: 0.1,
    growth: 0.05,
  };

  const breakdown: Record<string, number> = {
    reputation: reputation.reputationScore,
    culture: reputation.cultureScore,
    hiring: reputation.hiringScore,
    compensation: reputation.compensationScore,
    workLife: reputation.workLifeScore,
    leadership: reputation.leadershipScore,
    engineering: reputation.engineeringScore,
    growth: reputation.growthScore,
    toxicity: 5 - reputation.toxicityScore,
  };

  const overall =
    breakdown.reputation * weights.reputation +
    breakdown.culture * weights.culture +
    breakdown.hiring * weights.hiring +
    breakdown.compensation * weights.compensation +
    breakdown.workLife * weights.workLife +
    breakdown.leadership * weights.leadership +
    breakdown.engineering * weights.engineering +
    breakdown.growth * weights.growth;

  const adjusted = overall * reputation.confidence;

  return {
    overall: Math.round(adjusted * 100) / 100,
    breakdown,
    grade: scoreToGrade(adjusted),
  };
}

function scoreToGrade(score: number): string {
  if (score >= 4.5) return "A+";
  if (score >= 4.0) return "A";
  if (score >= 3.5) return "B+";
  if (score >= 3.0) return "B";
  if (score >= 2.5) return "C+";
  if (score >= 2.0) return "C";
  if (score >= 1.5) return "D";
  return "F";
}
