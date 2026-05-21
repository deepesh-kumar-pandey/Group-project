import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { aiSummarizeSchema } from "@/lib/validation/ai";
import { getOrCreateCompany } from "@/lib/services/company";
import { fetchAndPersistDiscussions, extractDiscussionTexts } from "@/lib/services/discussions";
import { summarizeCompanyDiscussions } from "@/lib/ai/summarize";
import { upsertAiSummary } from "@/lib/prisma/queries/ai";
import { SummaryType } from "@prisma/client";
import { invalidateAiCache } from "@/lib/ai/cache";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const { companySlug, forceRefresh, type } = aiSummarizeSchema.parse(body);

  if (forceRefresh) await invalidateAiCache(companySlug);

  const company = await getOrCreateCompany(companySlug, companySlug);
  const aggregation = await fetchAndPersistDiscussions({
    companyId: company.id,
    companyName: company.name,
    companySlug: company.slug,
  });

  const texts = extractDiscussionTexts(aggregation.posts);
  const summary = await summarizeCompanyDiscussions(
    company.name,
    texts,
    company.slug
  );

  const summaryType = (type ?? "COMPANY_OVERVIEW") as SummaryType;

  const stored = await upsertAiSummary({
    companyId: company.id,
    type: summaryType,
    title: summary.title,
    summary: summary.summary,
    pros: summary.pros,
    cons: summary.cons,
    highlights: summary.highlights,
    metadata: { confidence: summary.confidence },
  });

  return jsonSuccess({ summary, stored });
});

export const GET = POST;
