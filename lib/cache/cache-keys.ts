export const CacheKeys = {
  companySearch: (query: string) => `company:search:${query.toLowerCase()}`,
  companyDetails: (slug: string) => `company:details:${slug}`,
  companyTrending: () => "company:trending",
  redditSearch: (query: string, subreddit?: string) =>
    `reddit:search:${query.toLowerCase()}:${subreddit ?? "all"}`,
  redditAggregate: (companySlug: string) => `reddit:aggregate:${companySlug}`,
  aiSummary: (companySlug: string, type: string) =>
    `ai:summary:${companySlug}:${type}`,
  aiSentiment: (companySlug: string) => `ai:sentiment:${companySlug}`,
  aiReputation: (companySlug: string) => `ai:reputation:${companySlug}`,
  aiWorkplace: (companySlug: string) => `ai:workplace:${companySlug}`,
  geoapifySearch: (query: string) => `geoapify:search:${query.toLowerCase()}`,
  analyticsTrending: () => "analytics:trending",
  analyticsSentiment: (slug: string) => `analytics:sentiment:${slug}`,
  candidateReputation: (id: string) => `candidate:reputation:${id}`,
} as const;

export const CacheTTL = {
  SHORT: 60 * 5,
  MEDIUM: 60 * 30,
  LONG: 60 * 60 * 6,
  DAY: 60 * 60 * 24,
} as const;
