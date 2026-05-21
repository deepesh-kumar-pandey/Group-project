import { prisma } from "@/lib/prisma/client";
import { cacheGetOrSet } from "@/lib/cache/cache-manager";
import { CacheKeys, CacheTTL } from "@/lib/cache/cache-keys";

export interface TrendingCompany {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  reputationScore: number | null;
  searchCount: number;
  postCount: number;
}

export async function getTrendingCompanies(limit = 10): Promise<TrendingCompany[]> {
  return cacheGetOrSet(CacheKeys.analyticsTrending(), CacheTTL.MEDIUM, async () => {
    const companies = await prisma.company.findMany({
      take: limit,
      orderBy: { searchHistory: { _count: "desc" } },
      include: {
        companyScores: { orderBy: { computedAt: "desc" }, take: 1 },
        _count: { select: { redditPosts: true, searchHistory: true } },
      },
    });

    return companies.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      industry: c.industry,
      reputationScore: c.companyScores[0]?.reputationScore ?? null,
      searchCount: c._count.searchHistory,
      postCount: c._count.redditPosts,
    }));
  });
}

export async function getSentimentTrends(companySlug?: string, limit = 20) {
  const where = companySlug
    ? { company: { slug: companySlug } }
    : {};

  return prisma.sentimentScore.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      company: { select: { name: true, slug: true } },
    },
  });
}
