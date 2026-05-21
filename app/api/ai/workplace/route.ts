import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { aiWorkplaceSchema } from "@/lib/validation/ai";
import { getOrCreateCompany } from "@/lib/services/company";
import { fetchAndPersistDiscussions, extractDiscussionTexts } from "@/lib/services/discussions";
import { analyzeWorkplace } from "@/lib/ai/workplace";
import { upsertAiSummary } from "@/lib/prisma/queries/ai";
import { SummaryType } from "@prisma/client";
import { aggregateDiscussions } from "@/lib/analytics/aggregation";
import { generateInsights } from "@/lib/analytics/insights";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const { companySlug, focus } = aiWorkplaceSchema.parse(body);

  const company = await getOrCreateCompany(companySlug, companySlug);
  const aggregation = await fetchAndPersistDiscussions({
    companyId: company.id,
    companyName: company.name,
    companySlug: company.slug,
  });

  const texts = extractDiscussionTexts(aggregation.posts);
  const workplace = await analyzeWorkplace(
    company.name,
    texts,
    company.slug,
    focus
  );

  const discussionAgg = aggregateDiscussions(aggregation.posts);
  const insights = generateInsights(workplace, discussionAgg, 3.5);

  const stored = await upsertAiSummary({
    companyId: company.id,
    type: SummaryType.WORKPLACE_CULTURE,
    title: `${company.name} Workplace Analysis`,
    summary: workplace.summary,
    highlights: workplace.cultureInsights,
    metadata: { workplace, insights, focus },
  });

  return jsonSuccess({ workplace, insights, stored });
});

export const GET = POST;
