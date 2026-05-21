import Redis from "ioredis";
import { logger } from "@/lib/errors/logger";

let redisClient: Redis | null = null;
let redisAvailable = false;

function getRedisClient(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!redisClient) {
    try {
      redisClient = new Redis(url, {
        maxRetriesPerRequest: 2,
        lazyConnect: true,
        enableOfflineQueue: false,
      });

      redisClient.on("connect", () => {
        redisAvailable = true;
        logger.info("Redis connected");
      });

      redisClient.on("error", (err) => {
        redisAvailable = false;
        logger.warn("Redis error", { message: err.message });
      });
    } catch (error) {
      logger.warn("Redis initialization failed", {
        message: error instanceof Error ? error.message : "unknown",
      });
      return null;
    }
  }

  return redisClient;
}

export async function redisGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client || !redisAvailable) {
    try {
      if (client && client.status !== "ready") {
        await client.connect();
        redisAvailable = true;
      }
    } catch {
      return null;
    }
  }

  if (!client) return null;

  try {
    const raw = await client.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    redisAvailable = false;
    return null;
  }
}

export async function redisSet<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    if (client.status !== "ready") {
      await client.connect();
      redisAvailable = true;
    }
    await client.setex(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch {
    redisAvailable = false;
    return false;
  }
}

export async function redisDelete(key: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.del(key);
    return true;
  } catch {
    return false;
  }
}
