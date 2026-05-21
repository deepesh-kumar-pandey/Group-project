import { withRetry } from "@/lib/utils/retry";
import { ApiError } from "@/lib/errors/api-error";

const GEOAPIFY_BASE = "https://api.geoapify.com/v1";

export function getGeoapifyApiKey(): string {
  const key = process.env.GEOAPIFY_API_KEY;
  if (!key) {
    throw ApiError.internal("GEOAPIFY_API_KEY is not configured");
  }
  return key;
}

export async function geoapifyFetch<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T> {
  const searchParams = new URLSearchParams({
    ...params,
    apiKey: getGeoapifyApiKey(),
  });

  const url = `${GEOAPIFY_BASE}${endpoint}?${searchParams}`;

  return withRetry(
    async () => {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      });

      if (response.status === 429) {
        throw ApiError.rateLimited("Geoapify rate limit exceeded");
      }

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw ApiError.externalApi(`Geoapify API error: ${response.status}`, {
          body: text,
        });
      }

      return response.json() as Promise<T>;
    },
    { maxAttempts: 3 }
  );
}
