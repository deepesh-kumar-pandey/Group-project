import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { analyticsSentimentSchema } from "@/lib/validation/analytics";
import { getSentimentTrends } from "@/lib/analytics/trends";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { companySlug, limit } = analyticsSentimentSchema.parse(params);

  const trends = await getSentimentTrends(companySlug, limit ?? 20);

  return jsonSuccess({ trends });
});
