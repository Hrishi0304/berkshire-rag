import { Redis } from '@upstash/redis';
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
    throw new Error('Redis credentials are missing from .env');
}

export class RedisCacheService {
    private static redis = new Redis({
        url: redisUrl,
        token: redisToken,
    });

    static async get(key: string): Promise<string | null> {
        return this.redis.get<string>(key);
    }

    static async set(key: string, value: string, ttlSeconds: number = 86400):
        Promise<void> {
        await this.redis.set(key, value, { ex: ttlSeconds });
    }

    static async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }
}



