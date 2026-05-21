import { NextRequest } from "next/server";
import { withErrorHandling, jsonSuccess } from "@/lib/utils/route-handler";
import { companyReviewsSchema } from "@/lib/validation/company";
import { findCompanyBySlug } from "@/lib/prisma/queries/companies";
import { getRedditPostsByCompany } from "@/lib/prisma/queries/reddit";
import { prisma } from "@/lib/prisma/client";
import { parsePagination, buildPaginationMeta } from "@/lib/utils/pagination";
import { ApiError } from "@/lib/errors/api-error";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { slug, page, limit, source } = companyReviewsSchema.parse(params);
  const pagination = parsePagination(page, limit);

  const company = await findCompanyBySlug(slug);
  if (!company) {
    throw ApiError.notFound(`Company not found: ${slug}`);
  }

  if (source === "interview") {
    const [items, total] = await Promise.all([
      prisma.interviewReview.findMany({
        where: { companyId: company.id },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.interviewReview.count({ where: { companyId: company.id } }),
    ]);

    return jsonSuccess(
      { reviews: items, type: "interview" },
      buildPaginationMeta(total, pagination)
    );
  }

  const { items, total } = await getRedditPostsByCompany(company.id, pagination);

  return jsonSuccess(
    { reviews: items, type: "reddit" },
    buildPaginationMeta(total, pagination)
  );
});
