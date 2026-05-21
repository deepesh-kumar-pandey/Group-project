import { withRetry } from "@/lib/utils/retry";
import { ApiError } from "@/lib/errors/api-error";
import { getRedditAccessToken } from "./oauth";
import { getRedditUserAgent, isRedditOAuthConfigured } from "./config";

const REDDIT_BASE = "https://www.reddit.com";
const REDDIT_OAUTH_BASE = "https://oauth.reddit.com";

export { getRedditUserAgent } from "./config";

function getRedditBaseUrl(): string {
  return isRedditOAuthConfigured() ? REDDIT_OAUTH_BASE : REDDIT_BASE;
}

export async function getRedditAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "User-Agent": getRedditUserAgent(),
    Accept: "application/json",
  };

  const token = await getRedditAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function redditFetch<T>(path: string): Promise<T> {
  const base = getRedditBaseUrl();
  const url = path.startsWith("http")
    ? path.replace(REDDIT_BASE, REDDIT_OAUTH_BASE)
    : `${base}${path}`;

  return withRetry(
    async () => {
      const headers = await getRedditAuthHeaders();

      const response = await fetch(url, {
        headers,
        next: { revalidate: 0 },
      });

      if (response.status === 429) {
        throw ApiError.rateLimited("Reddit rate limit exceeded");
      }

      if (!response.ok) {
        throw ApiError.externalApi(`Reddit API error: ${response.status}`, {
          status: response.status,
          oauth: isRedditOAuthConfigured(),
        });
      }

      return response.json() as Promise<T>;
    },
    {
      maxAttempts: 3,
      shouldRetry: (error) => {
        if (error instanceof ApiError && error.code === "RATE_LIMITED") {
          return true;
        }
        return !(error instanceof ApiError);
      },
    }
  );
}

export async function redditFetchJson<T>(path: string): Promise<T> {
  return redditFetch<T>(path);
}
