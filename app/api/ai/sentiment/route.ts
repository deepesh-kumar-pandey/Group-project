import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { aiSentimentSchema } from "@/lib/validation/ai";
import { getOrCreateCompany } from "@/lib/services/company";
import { fetchAndPersistDiscussions, extractDiscussionTexts } from "@/lib/services/discussions";
import { analyzeSentiment } from "@/lib/ai/sentiment";
import { createSentimentScore } from "@/lib/prisma/queries/ai";
import { normalizeSentimentLabel } from "@/lib/ai/normalize-ai";

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const { companySlug, texts: overrideTexts } = aiSentimentSchema.parse(body);

  const company = await getOrCreateCompany(companySlug, companySlug);

  let texts = overrideTexts ?? [];
  if (texts.length === 0) {
    const aggregation = await fetchAndPersistDiscussions({
      companyId: company.id,
      companyName: company.name,
      companySlug: company.slug,
    });
    texts = extractDiscussionTexts(aggregation.posts);
  }

  const sentiment = await analyzeSentiment(company.name, texts, company.slug);

  const stored = await createSentimentScore({
    company: { connect: { id: company.id } },
    overallScore: sentiment.overallScore,
    label: normalizeSentimentLabel(sentiment.label),
    positiveRatio: sentiment.positiveRatio,
    negativeRatio: sentiment.negativeRatio,
    neutralRatio: sentiment.neutralRatio,
    sampleSize: sentiment.sampleSize,
    breakdown: { themes: sentiment.themes },
  });

  return jsonSuccess({ sentiment, stored });
});

export const GET = POST;
