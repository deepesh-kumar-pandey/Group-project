import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { analyticsTrendingSchema } from "@/lib/validation/analytics";
import { getTrendingCompanies } from "@/lib/analytics/trends";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { limit } = analyticsTrendingSchema.parse(params);

  const trending = await getTrendingCompanies(limit ?? 10);

  return jsonSuccess({ trending });
});
