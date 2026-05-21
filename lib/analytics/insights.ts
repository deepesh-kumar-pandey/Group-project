import type { AiWorkplaceResult } from "@/lib/ai/types";
import type { DiscussionAggregation } from "./aggregation";

export interface PlatformInsights {
  summary: string;
  keyFindings: string[];
  risks: string[];
  opportunities: string[];
  hiringOutlook: string;
  cultureRating: string;
}

export function generateInsights(
  workplace: AiWorkplaceResult,
  aggregation: DiscussionAggregation,
  reputationScore: number
): PlatformInsights {
  const keyFindings: string[] = [];
  const risks: string[] = [];
  const opportunities: string[] = [];

  if (workplace.cultureInsights.length > 0) {
    keyFindings.push(workplace.cultureInsights[0]);
  }
  if (workplace.hiringSentiment.length > 0) {
    keyFindings.push(`Hiring: ${workplace.hiringSentiment[0]}`);
  }

  if (reputationScore < 3) {
    risks.push("Below-average reputation score based on aggregated discussions");
  }
  if (workplace.workLifeBalance.some((w) => w.toLowerCase().includes("burnout"))) {
    risks.push("Work-life balance concerns mentioned in discussions");
  }

  if (workplace.engineeringCulture.length > 0) {
    opportunities.push(workplace.engineeringCulture[0]);
  }
  if (aggregation.totalDiscussions > 20) {
    opportunities.push(`Strong discussion volume (${aggregation.totalDiscussions} posts) enables reliable analysis`);
  }

  const hiringOutlook =
    workplace.hiringSentiment.length > 0
      ? workplace.hiringSentiment.join("; ")
      : "Insufficient hiring data";

  const cultureRating =
    reputationScore >= 4 ? "Positive" : reputationScore >= 3 ? "Mixed" : "Concerning";

  return {
    summary: workplace.summary,
    keyFindings,
    risks,
    opportunities,
    hiringOutlook,
    cultureRating,
  };
}
