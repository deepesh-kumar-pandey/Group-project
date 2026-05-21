import { cacheDelete, cacheGet } from "@/lib/cache/cache-manager";
import { CacheKeys } from "@/lib/cache/cache-keys";
import type { NormalizedCompany } from "./types";

export async function getCachedGeoapifySearch(
  query: string
): Promise<NormalizedCompany[] | null> {
  return cacheGet<NormalizedCompany[]>(CacheKeys.geoapifySearch(query));
}

export async function invalidateGeoapifyCache(query: string): Promise<void> {
  await cacheDelete(CacheKeys.geoapifySearch(query));
}
