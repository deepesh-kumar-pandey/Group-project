import type { GeoapifyPlace, NormalizedCompany } from "./types";

export function normalizeGeoapifyPlace(place: GeoapifyPlace): NormalizedCompany {
  return {
    name: place.name ?? place.formatted ?? "Unknown",
    formattedAddress: place.formatted ?? null,
    city: place.city ?? null,
    country: place.country ?? null,
    latitude: place.lat ?? null,
    longitude: place.lon ?? null,
    geoapifyId: place.place_id,
    website: place.website ?? null,
    category: place.category ?? place.result_type ?? null,
    metadata: {
      addressLine1: place.address_line1,
      addressLine2: place.address_line2,
      state: place.state,
      countryCode: place.country_code,
      postcode: place.postcode,
      datasource: place.datasource,
      contact: place.contact,
    },
  };
}

export function normalizeGeoapifyPlaces(
  places: GeoapifyPlace[]
): NormalizedCompany[] {
  return places.map(normalizeGeoapifyPlace);
}
