import { cacheDelete, cacheGet } from "@/lib/cache/cache-manager";
import { CacheKeys } from "@/lib/cache/cache-keys";

export async function invalidateAiCache(companySlug: string): Promise<void> {
  await Promise.all([
    cacheDelete(CacheKeys.aiSummary(companySlug, "overview")),
    cacheDelete(CacheKeys.aiSentiment(companySlug)),
    cacheDelete(CacheKeys.aiReputation(companySlug)),
    cacheDelete(CacheKeys.aiWorkplace(companySlug)),
  ]);
}

export async function getCachedAiSummary<T>(
  companySlug: string,
  type: string
): Promise<T | null> {
  return cacheGet<T>(CacheKeys.aiSummary(companySlug, type));
}
