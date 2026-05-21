import { geoapifyFetch } from "./client";
import { normalizeGeoapifyPlaces } from "./normalize-company";
import type { GeoapifySearchResult, NormalizedCompany } from "./types";
import { cacheGetOrSet } from "@/lib/cache/cache-manager";
import { CacheKeys, CacheTTL } from "@/lib/cache/cache-keys";

export interface CompanySearchParams {
  query: string;
  limit?: number;
  country?: string;
}

export async function searchCompany(
  params: CompanySearchParams
): Promise<NormalizedCompany[]> {
  const cacheKey = CacheKeys.geoapifySearch(
    `${params.query}:${params.country ?? "all"}`
  );

  return cacheGetOrSet(cacheKey, CacheTTL.MEDIUM, async () => {
    const result = await geoapifyFetch<GeoapifySearchResult>(
      "/geocode/search",
      {
        text: params.query,
        limit: String(params.limit ?? 10),
        ...(params.country ? { filter: `countrycode:${params.country}` } : {}),
        type: "commercial",
      }
    );

    const places = result.features.map((f) => f.properties);
    return normalizeGeoapifyPlaces(places);
  });
}
