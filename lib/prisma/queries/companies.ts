import { prisma } from "@/lib/prisma/client";
import type { Prisma } from "@prisma/client";
import { getSkip, type PaginationParams } from "@/lib/utils/pagination";

export async function findCompanyBySlug(slug: string) {
  return prisma.company.findUnique({
    where: { slug },
    include: {
      companyScores: { orderBy: { computedAt: "desc" }, take: 1 },
      sentimentScores: { orderBy: { createdAt: "desc" }, take: 1 },
      aiSummaries: { orderBy: { updatedAt: "desc" } },
    },
  });
}

export async function findCompanyById(id: string) {
  return prisma.company.findUnique({ where: { id } });
}

export async function searchCompanies(
  query: string,
  pagination: PaginationParams
) {
  const where: Prisma.CompanyWhereInput = {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { slug: { contains: query, mode: "insensitive" } },
      { industry: { contains: query, mode: "insensitive" } },
    ],
  };

  const [items, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip: getSkip(pagination),
      take: pagination.limit,
      orderBy: { name: "asc" },
      include: {
        companyScores: { orderBy: { computedAt: "desc" }, take: 1 },
      },
    }),
    prisma.company.count({ where }),
  ]);

  return { items, total };
}

export async function upsertCompany(data: Prisma.CompanyCreateInput) {
  return prisma.company.upsert({
    where: { slug: data.slug },
    create: data,
    update: {
      name: data.name,
      description: data.description,
      industry: data.industry,
      website: data.website,
      headquarters: data.headquarters,
      country: data.country,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      geoapifyId: data.geoapifyId,
      metadata: data.metadata,
    },
  });
}

export async function getTrendingCompanies(limit: number) {
  return prisma.company.findMany({
    take: limit,
    orderBy: {
      searchHistory: { _count: "desc" },
    },
    include: {
      companyScores: { orderBy: { computedAt: "desc" }, take: 1 },
      _count: { select: { redditPosts: true, searchHistory: true } },
    },
  });
}

export async function recordSearchHistory(params: {
  userId?: string;
  companyId?: string;
  query: string;
  source?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  return prisma.searchHistory.create({
    data: {
      userId: params.userId,
      companyId: params.companyId,
      query: params.query,
      source: params.source ?? "api",
      metadata: params.metadata,
    },
  });
}
