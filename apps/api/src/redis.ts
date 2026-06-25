import { loadEnvironment } from "@genki/config";
import Redis from "ioredis";

const environment = loadEnvironment();

export const redis = new Redis(environment.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

export const checkRedis = async (): Promise<boolean> => {
  try {
    if (redis.status === "wait") await redis.connect();
    return (await redis.ping()) === "PONG";
  } catch {
    return false;
  }
};
