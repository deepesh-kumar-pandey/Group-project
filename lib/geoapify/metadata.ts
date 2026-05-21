import { geoapifyFetch } from "./client";
import { normalizeGeoapifyPlace } from "./normalize-company";
import type { GeoapifySearchResult, NormalizedCompany } from "./types";
import { ApiError } from "@/lib/errors/api-error";

export async function getCompanyMetadata(
  placeId: string
): Promise<NormalizedCompany | null> {
  const result = await geoapifyFetch<GeoapifySearchResult>("/geocode/search", {
    place_id: placeId,
    limit: "1",
  });

  const place = result.features[0]?.properties;
  if (!place) {
    throw ApiError.notFound(`Company metadata not found for place: ${placeId}`);
  }

  return normalizeGeoapifyPlace(place);
}

export async function reverseGeocodeCompany(
  lat: number,
  lon: number
): Promise<NormalizedCompany | null> {
  const result = await geoapifyFetch<GeoapifySearchResult>("/geocode/reverse", {
    lat: String(lat),
    lon: String(lon),
    limit: "1",
  });

  const place = result.features[0]?.properties;
  if (!place) return null;

  return normalizeGeoapifyPlace(place);
}
