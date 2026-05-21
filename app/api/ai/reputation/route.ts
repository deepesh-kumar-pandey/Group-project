import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { aiReputationSchema } from "@/lib/validation/ai";
import { getOrCreateCompany } from "@/lib/services/company";
import { fetchAndPersistDiscussions, extractDiscussionTexts } from "@/lib/services/discussions";
import { getReputationReport } from "@/lib/analytics/reputation";
import { upsertCompanyScore } from "@/lib/prisma/queries/ai";
import { analyzeToxicity } from "@/lib/ai/toxicity";
import { upsertAiSummary } from "@/lib/prisma/queries/ai";
import { SummaryType } from "@prisma/client";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const { companySlug, forceRefresh } = aiReputationSchema.parse(body);

  const company = await getOrCreateCompany(companySlug, companySlug);
  const aggregation = await fetchAndPersistDiscussions({
    companyId: company.id,
    companyName: company.name,
    companySlug: company.slug,
  });

  const texts = extractDiscussionTexts(aggregation.posts);
  const report = await getReputationReport(
    company.id,
    company.name,
    company.slug,
    texts,
    forceRefresh
  );

  const reputation = report.computed;
  if (!reputation) {
    return jsonSuccess({ report, message: "Using cached scores" });
  }

  const [stored, toxicity] = await Promise.all([
    upsertCompanyScore(company.id, {
      reputationScore: reputation.reputationScore,
      cultureScore: reputation.cultureScore,
      hiringScore: reputation.hiringScore,
      compensationScore: reputation.compensationScore,
      workLifeScore: reputation.workLifeScore,
      leadershipScore: reputation.leadershipScore,
      toxicityScore: reputation.toxicityScore,
      engineeringScore: reputation.engineeringScore,
      growthScore: reputation.growthScore,
      confidence: reputation.confidence,
      factors: { factors: reputation.factors },
    }),
    analyzeToxicity(company.name, texts),
  ]);

  await upsertAiSummary({
    companyId: company.id,
    type: SummaryType.REPUTATION,
    title: `${company.name} Reputation`,
    summary: reputation.summary,
    metadata: { toxicity },
  });

  return jsonSuccess({
    reputation,
    composite: report.composite,
    toxicity,
    stored,
  });
});

export const GET = POST;
