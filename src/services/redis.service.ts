import { createClient, RedisClientType } from "redis";

class RedisService {
  protected client: RedisClientType;
  constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env?.REDIS_PORT as string, 10) || 6379,
      },
      password: (process.env?.REDIS_PASSWORD as string) || "",
    });
  }

  async connect(): Promise<void> {
    return await this.client.connect();
  }

  async set(key: string, value: string, expire?: number): Promise<void> {
    await this.client.set(key, value);
    if (expire) {
      await this.client.expire(key, expire);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
}

let redisService: RedisService;
export async function RedisSingletonService() {
  if (!redisService) {
    redisService = new RedisService();
    await redisService.connect();
  }
  return redisService;
}
