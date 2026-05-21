import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { getOrCreateCompany, trackCompanySearch } from "@/lib/services/company";
import { findCompanyBySlug } from "@/lib/prisma/queries/companies";
import { optionalDbUser } from "@/lib/supabase/auth";
import { getLatestCompanyScore } from "@/lib/prisma/queries/ai";

export const GET = withErrorHandling(async (
  _request: NextRequest,
  context?: { params: Promise<Record<string, string>> }
) => {
  const { slug } = await context!.params;
  await getOrCreateCompany(slug, slug);
  const company = await findCompanyBySlug(slug);

  const dbUser = await optionalDbUser();
  await trackCompanySearch({
    slug,
    query: slug,
    userId: dbUser?.id,
    companyId: company!.id,
  }).catch(() => {});

  const latestScore = await getLatestCompanyScore(company!.id);

  return jsonSuccess({
    company,
    scores: latestScore,
    sentiment: company!.sentimentScores?.[0] ?? null,
    summaries: company!.aiSummaries ?? [],
  });
});
