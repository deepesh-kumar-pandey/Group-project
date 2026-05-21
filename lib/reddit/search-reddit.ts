import { redditFetch } from "./client";
import { normalizeRedditPosts } from "./normalize-posts";
import type { RedditSearchResponse, NormalizedRedditPost } from "./types";
import { checkRateLimit } from "./rate-limit";
import { ApiError } from "@/lib/errors/api-error";
import { cacheGetOrSet } from "@/lib/cache/cache-manager";
import { CacheKeys, CacheTTL } from "@/lib/cache/cache-keys";

export interface RedditSearchParams {
  query: string;
  subreddit?: string;
  sort?: "relevance" | "hot" | "top" | "new" | "comments";
  time?: "hour" | "day" | "week" | "month" | "year" | "all";
  limit?: number;
  after?: string;
}

export interface RedditSearchResult {
  posts: NormalizedRedditPost[];
  after: string | null;
  total: number;
}

export async function searchReddit(
  params: RedditSearchParams
): Promise<RedditSearchResult> {
  if (!checkRateLimit()) {
    throw ApiError.rateLimited("Internal Reddit rate limit exceeded");
  }

  const cacheKey = CacheKeys.redditSearch(params.query, params.subreddit);

  return cacheGetOrSet(cacheKey, CacheTTL.SHORT, async () => {
    const searchParams = new URLSearchParams({
      q: params.query,
      limit: String(params.limit ?? 25),
      sort: params.sort ?? "relevance",
      t: params.time ?? "all",
      restrict_sr: params.subreddit ? "true" : "false",
      type: "link",
    });

    if (params.subreddit) {
      searchParams.set("q", `${params.query} subreddit:${params.subreddit}`);
    }

    if (params.after) {
      searchParams.set("after", params.after);
    }

    const path = params.subreddit
      ? `/r/${params.subreddit}/search.json?${searchParams}`
      : `/search.json?${searchParams}`;

    const response = await redditFetch<RedditSearchResponse>(path);
    const posts = response.data.children
      .filter((child) => child.kind === "t3")
      .map((child) => child.data);

    return {
      posts: normalizeRedditPosts(posts),
      after: response.data.after,
      total: response.data.dist ?? posts.length,
    };
  });
}
