import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { redditAggregateSchema } from "@/lib/validation/reddit";
import { getOrCreateCompany } from "@/lib/services/company";
import { fetchAndPersistDiscussions } from "@/lib/services/discussions";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { companySlug, query, limit } = redditAggregateSchema.parse(params);

  const company = await getOrCreateCompany(companySlug, query ?? companySlug);

  const aggregation = await fetchAndPersistDiscussions({
    companyId: company.id,
    companyName: company.name,
    companySlug: company.slug,
    limit,
  });

  return jsonSuccess({
    company: { id: company.id, name: company.name, slug: company.slug },
    aggregation,
  });
});

export const POST = GET;
