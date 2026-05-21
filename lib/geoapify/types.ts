export interface GeoapifyFeature {
  type: string;
  properties: GeoapifyPlace;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

export interface GeoapifyPlace {
  place_id: string;
  name?: string;
  formatted?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  country_code?: string;
  postcode?: string;
  lat?: number;
  lon?: number;
  result_type?: string;
  category?: string;
  datasource?: {
    sourcename?: string;
    attribution?: string;
  };
  website?: string;
  contact?: {
    phone?: string;
  };
}

export interface GeoapifySearchResult {
  type: string;
  features: GeoapifyFeature[];
  query?: {
    text: string;
    parsed?: Record<string, string>;
  };
}

export interface NormalizedCompany {
  name: string;
  formattedAddress: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  geoapifyId: string;
  website: string | null;
  category: string | null;
  metadata: Record<string, unknown>;
}
