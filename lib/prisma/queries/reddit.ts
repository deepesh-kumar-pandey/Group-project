import { prisma } from "@/lib/prisma/client";
import type { Prisma, SentimentLabel } from "@prisma/client";
import { getSkip, type PaginationParams } from "@/lib/utils/pagination";

export async function upsertRedditPost(data: Prisma.RedditPostCreateInput) {
  return prisma.redditPost.upsert({
    where: { redditId: data.redditId },
    create: data,
    update: {
      title: data.title,
      content: data.content,
      score: data.score,
      numComments: data.numComments,
      sentiment: data.sentiment,
      sentimentScore: data.sentimentScore,
      fetchedAt: new Date(),
    },
  });
}

export async function getRedditPostsByCompany(
  companyId: string,
  pagination: PaginationParams
) {
  const where = { companyId };

  const [items, total] = await Promise.all([
    prisma.redditPost.findMany({
      where,
      skip: getSkip(pagination),
      take: pagination.limit,
      orderBy: { postedAt: "desc" },
    }),
    prisma.redditPost.count({ where }),
  ]);

  return { items, total };
}

export async function getRedditPostsForAggregation(companyId: string, limit = 50) {
  return prisma.redditPost.findMany({
    where: { companyId },
    orderBy: [{ score: "desc" }, { postedAt: "desc" }],
    take: limit,
  });
}

export async function updatePostSentiment(
  redditId: string,
  sentiment: SentimentLabel,
  sentimentScore: number
) {
  return prisma.redditPost.update({
    where: { redditId },
    data: { sentiment, sentimentScore },
  });
}
