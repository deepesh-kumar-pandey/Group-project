const requestTimestamps: number[] = [];
const MAX_REQUESTS_PER_MINUTE = 30;

export function checkRateLimit(): boolean {
  const now = Date.now();
  const oneMinuteAgo = now - 60_000;

  while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  requestTimestamps.push(now);
  return true;
}

export function getRateLimitRemaining(): number {
  const now = Date.now();
  const oneMinuteAgo = now - 60_000;
  const recent = requestTimestamps.filter((t) => t >= oneMinuteAgo);
  return Math.max(0, MAX_REQUESTS_PER_MINUTE - recent.length);
}
