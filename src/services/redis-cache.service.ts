import {Redis} from '@upstash/redis';
const rawRedisUrl = process.env.UPSTASH_REDIS_REST_URL;
const rawRedisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if(!rawRedisUrl || !rawRedisToken){
    throw new Error('Redis credentials are missing from .env');
}

const redisUrl = rawRedisUrl.replace(/^['"]|['"]$/g, '');
const redisToken = rawRedisToken.replace(/^['"]|['"]$/g, '');

export class RedisCacheService {
    private static redis = new Redis({
        url: redisUrl,
        token: redisToken,
    });

    static async get(key: string): Promise<string | null>{
        return this.redis.get<string>(key);
    }

    static async set(key: string, value: string, ttlSeconds: number = 86400):
    Promise<void> {
        await this.redis.set(key, value, { ex: ttlSeconds });
    }

    static async delete(key: string): Promise<void>{
        await this.redis.del(key);
    }
}



