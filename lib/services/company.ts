import { findCompanyBySlug, upsertCompany, recordSearchHistory } from "@/lib/prisma/queries/companies";
import { searchCompany as geoSearch } from "@/lib/geoapify/search-company";
import { slugify, normalizeCompanyName } from "@/lib/utils/slug";
import { ApiError } from "@/lib/errors/api-error";

export async function getOrCreateCompany(slug: string, query?: string) {
  let company = await findCompanyBySlug(slug);

  if (!company && query) {
    const geoResults = await geoSearch({ query, limit: 1 });
    const geo = geoResults[0];

    if (geo) {
      company = await upsertCompany({
        name: normalizeCompanyName(geo.name),
        slug: slugify(geo.name),
        headquarters: geo.formattedAddress,
        city: geo.city,
        country: geo.country,
        latitude: geo.latitude,
        longitude: geo.longitude,
        geoapifyId: geo.geoapifyId,
        website: geo.website,
        metadata: geo.metadata,
      });
    }
  }

  if (!company) {
    throw ApiError.notFound(`Company not found: ${slug}`);
  }

  return company;
}

export async function trackCompanySearch(params: {
  slug: string;
  query: string;
  userId?: string;
  companyId?: string;
}) {
  const company = await findCompanyBySlug(params.slug);
  return recordSearchHistory({
    userId: params.userId,
    companyId: company?.id ?? params.companyId,
    query: params.query,
    source: "api",
    metadata: { slug: params.slug },
  });
}
