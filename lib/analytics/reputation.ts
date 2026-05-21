import { getLatestCompanyScore } from "@/lib/prisma/queries/ai";
import { analyzeReputation } from "@/lib/ai/reputation";
import { computeCompositeScore } from "./scoring";
import type { AiReputationResult } from "@/lib/ai/types";

export interface ReputationReport {
  stored: Awaited<ReturnType<typeof getLatestCompanyScore>>;
  computed: AiReputationResult | null;
  composite: ReturnType<typeof computeCompositeScore> | null;
}

export async function getReputationReport(
  companyId: string,
  companyName: string,
  companySlug: string,
  discussions: string[],
  forceRefresh = false
): Promise<ReputationReport> {
  const stored = await getLatestCompanyScore(companyId);

  if (stored && !forceRefresh) {
    const composite = computeCompositeScore({
      reputationScore: stored.reputationScore,
      cultureScore: stored.cultureScore ?? 3,
      hiringScore: stored.hiringScore ?? 3,
      compensationScore: stored.compensationScore ?? 3,
      workLifeScore: stored.workLifeScore ?? 3,
      leadershipScore: stored.leadershipScore ?? 3,
      toxicityScore: stored.toxicityScore ?? 0,
      engineeringScore: stored.engineeringScore ?? 3,
      growthScore: stored.growthScore ?? 3,
      confidence: stored.confidence,
      factors: [],
      summary: "",
    });

    return { stored, computed: null, composite };
  }

  const computed = await analyzeReputation(companyName, discussions, companySlug);
  const composite = computeCompositeScore(computed);

  return { stored, computed, composite };
}
