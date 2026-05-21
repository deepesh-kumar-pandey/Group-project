export function getRedditUserAgent(): string {
  return (
    process.env.REDDIT_USER_AGENT ??
    "review-platform/1.0.0 (workplace-intelligence)"
  );
}

export function isRedditOAuthConfigured(): boolean {
  const clientId = process.env.REDDIT_CLIENT_ID?.trim();
  const clientSecret = process.env.REDDIT_CLIENT_SECRET?.trim();
  return Boolean(clientId && clientSecret);
}

export function getRedditOAuthCredentials() {
  const clientId = process.env.REDDIT_CLIENT_ID?.trim();
  const clientSecret = process.env.REDDIT_CLIENT_SECRET?.trim();
  const username = process.env.REDDIT_USERNAME?.trim();
  const password = process.env.REDDIT_PASSWORD?.trim();

  if (!clientId || !clientSecret) {
    return null;
  }

  return { clientId, clientSecret, username, password };
}
