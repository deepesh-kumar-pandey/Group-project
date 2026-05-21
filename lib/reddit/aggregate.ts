import { searchReddit } from "./search-reddit";
import { aggregateSentiment } from "./sentiment-parser";
import type { NormalizedRedditPost } from "./types";
import { cacheGetOrSet } from "@/lib/cache/cache-manager";
import { CacheKeys, CacheTTL } from "@/lib/cache/cache-keys";

export interface RedditAggregation {
  posts: NormalizedRedditPost[];
  totalPosts: number;
  totalComments: number;
  avgScore: number;
  topSubreddits: { subreddit: string; count: number }[];
  sentiment: {
    label: string;
    score: number;
    distribution: Record<string, number>;
  };
  engagement: {
    totalScore: number;
    avgComments: number;
  };
}

export async function aggregateRedditDiscussions(params: {
  query: string;
  companySlug: string;
  limit?: number;
}): Promise<RedditAggregation> {
  const cacheKey = CacheKeys.redditAggregate(params.companySlug);

  return cacheGetOrSet(cacheKey, CacheTTL.MEDIUM, async () => {
    const searchQueries = [
      params.query,
      `${params.query} interview`,
      `${params.query} workplace`,
      `${params.query} culture`,
    ];

    const allPosts: NormalizedRedditPost[] = [];
    const seen = new Set<string>();

    for (const q of searchQueries) {
      const result = await searchReddit({
        query: q,
        limit: Math.ceil((params.limit ?? 50) / searchQueries.length),
        sort: "relevance",
        time: "year",
      });

      for (const post of result.posts) {
        if (!seen.has(post.redditId)) {
          seen.add(post.redditId);
          allPosts.push(post);
        }
      }
    }

    const texts = allPosts.map(
      (p) => `${p.title} ${p.content ?? ""}`.trim()
    );

    const sentiment = aggregateSentiment(texts);

    const subredditCounts = new Map<string, number>();
    for (const post of allPosts) {
      subredditCounts.set(
        post.subreddit,
        (subredditCounts.get(post.subreddit) ?? 0) + 1
      );
    }

    const topSubreddits = [...subredditCounts.entries()]
      .map(([subreddit, count]) => ({ subreddit, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const totalScore = allPosts.reduce((sum, p) => sum + p.score, 0);
    const totalComments = allPosts.reduce((sum, p) => sum + p.numComments, 0);

    return {
      posts: allPosts,
      totalPosts: allPosts.length,
      totalComments,
      avgScore: allPosts.length > 0 ? totalScore / allPosts.length : 0,
      topSubreddits,
      sentiment: {
        label: sentiment.label,
        score: sentiment.score,
        distribution: sentiment.distribution,
      },
      engagement: {
        totalScore,
        avgComments: allPosts.length > 0 ? totalComments / allPosts.length : 0,
      },
    };
  });
}
