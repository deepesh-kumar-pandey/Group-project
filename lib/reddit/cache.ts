import { cacheDelete, cacheGet, cacheSet } from "@/lib/cache/cache-manager";
import { CacheKeys, CacheTTL } from "@/lib/cache/cache-keys";
import type { RedditSearchResult } from "./search-reddit";
import type { RedditAggregation } from "./aggregate";

export async function getCachedRedditSearch(
  query: string,
  subreddit?: string
): Promise<RedditSearchResult | null> {
  return cacheGet<RedditSearchResult>(CacheKeys.redditSearch(query, subreddit));
}

export async function setCachedRedditSearch(
  query: string,
  data: RedditSearchResult,
  subreddit?: string
): Promise<void> {
  await cacheSet(CacheKeys.redditSearch(query, subreddit), data, CacheTTL.SHORT);
}

export async function invalidateRedditCache(
  query: string,
  companySlug?: string
): Promise<void> {
  await cacheDelete(CacheKeys.redditSearch(query));
  if (companySlug) {
    await cacheDelete(CacheKeys.redditAggregate(companySlug));
  }
}

export async function getCachedAggregation(
  companySlug: string
): Promise<RedditAggregation | null> {
  return cacheGet<RedditAggregation>(CacheKeys.redditAggregate(companySlug));
}
