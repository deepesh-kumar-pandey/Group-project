import { ApiError } from "@/lib/errors/api-error";
import { logger } from "@/lib/errors/logger";
import {
  getRedditUserAgent,
  getRedditOAuthCredentials,
  isRedditOAuthConfigured,
} from "./config";

export { isRedditOAuthConfigured } from "./config";

const TOKEN_URL = "https://www.reddit.com/api/v1/access_token";
const TOKEN_REFRESH_BUFFER_MS = 60_000;

interface RedditTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

async function requestAccessToken(): Promise<CachedToken> {
  const credentials = getRedditOAuthCredentials();
  if (!credentials) {
    throw ApiError.internal("Reddit OAuth credentials are not configured");
  }

  const { clientId, clientSecret, username, password } = credentials;
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const body = new URLSearchParams();
  if (username && password) {
    body.set("grant_type", "password");
    body.set("username", username);
    body.set("password", password);
  } else {
    body.set("grant_type", "client_credentials");
  }

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "User-Agent": getRedditUserAgent(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    logger.error("Reddit OAuth token request failed", {
      status: response.status,
      body: text.slice(0, 200),
    });
    throw ApiError.externalApi("Failed to obtain Reddit OAuth token", {
      status: response.status,
      hint:
        "For script apps, set REDDIT_USERNAME and REDDIT_PASSWORD. For installed apps, only CLIENT_ID and CLIENT_SECRET are needed.",
    });
  }

  const data = (await response.json()) as RedditTokenResponse;

  return {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - TOKEN_REFRESH_BUFFER_MS,
  };
}

export async function getRedditAccessToken(): Promise<string | null> {
  if (!isRedditOAuthConfigured()) {
    return null;
  }

  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }

  cachedToken = await requestAccessToken();
  return cachedToken.accessToken;
}

export function clearRedditTokenCache(): void {
  cachedToken = null;
}
