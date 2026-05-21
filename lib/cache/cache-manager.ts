import { memoryCache } from "./memory-cache";
import { redisDelete, redisGet, redisSet } from "./redis-cache";

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redisValue = await redisGet<T>(key);
  if (redisValue !== null) return redisValue;
  return memoryCache.get<T>(key);
}

export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  await Promise.all([
    redisSet(key, value, ttlSeconds),
    memoryCache.set(key, value, ttlSeconds),
  ]);
}

export async function cacheDelete(key: string): Promise<void> {
  await Promise.all([redisDelete(key), memoryCache.delete(key)]);
}

export async function cacheGetOrSet<T>(
  key: string,
  ttlSeconds: number,
  factory: () => Promise<T>
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const value = await factory();
  await cacheSet(key, value, ttlSeconds);
  return value;
}
