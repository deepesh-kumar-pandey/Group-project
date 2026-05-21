import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { companySearchSchema } from "@/lib/validation/company";
import { searchCompanies } from "@/lib/prisma/queries/companies";
import { searchCompany as geoSearch } from "@/lib/geoapify/search-company";
import { parsePagination, buildPaginationMeta } from "@/lib/utils/pagination";
import { optionalDbUser } from "@/lib/supabase/auth";
import { recordSearchHistory } from "@/lib/prisma/queries/companies";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { q, page, limit, enrich } = companySearchSchema.parse(params);
  const pagination = parsePagination(page, limit);

  const [{ items, total }, geoResults] = await Promise.all([
    searchCompanies(q, pagination),
    enrich ? geoSearch({ query: q, limit: 5 }) : Promise.resolve([]),
  ]);

  const dbUser = await optionalDbUser();
  if (dbUser) {
    await recordSearchHistory({
      userId: dbUser.id,
      query: q,
      source: "company_search",
    }).catch(() => {});
  }

  return jsonSuccess(
    { companies: items, geoapify: geoResults },
    buildPaginationMeta(total, pagination)
  );
});
