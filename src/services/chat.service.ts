import { mastra } from "../mastra";
import { AppError } from "../utils/api-error";
import { tryCatch } from "../utils/try-catch";
import crypto from 'crypto';
import { RedisCacheService } from "./redis-cache.service";

export class ChatService {
    static async generateResponse(prompt: string): Promise<string>{
        // 1. Create deterministic SHA-256 hash of the normalized prompt
        const normalizedPrompt = prompt.trim().toLowerCase();
        const hash = crypto.createHash('sha256').update(normalizedPrompt).digest('hex');
        const cacheKey = `chat:response:${hash}`;

        // 2. Fetch from Redis (fail-silent)
        const [cachedAnswer, cacheError] = await tryCatch(RedisCacheService.get(cacheKey));

        if(cacheError){
            console.error('⚠️ Redis cache retrieval failed:', cacheError);
        }

        if(cachedAnswer){
            console.log(`⚡ [Cache HIT] Serving cached response for key: ${cacheKey}`);
            return cachedAnswer;
        }

        console.log(`🐢 [Cache MISS] Executing heavy RAG pipeline...`);

        // 3. Cache Miss: Run heavy RAG pipeline
        const [result,error] = await tryCatch(mastra.getAgent('berkshireAgent').generate(prompt));

        if(error){
            console.log('Mastra Error: ',error);
            throw new AppError('The AI agent failed to process your request. ', 500);
        }
        const responseText = result.text;

        // 4. Asynchronously populate cache for future hits (TTL: 24 hours)
        if(responseText){
            const [,setCacheError] = await tryCatch(RedisCacheService.set(cacheKey,responseText,86400));
            if (setCacheError){
                console.error('⚠️ Redis cache write failed:', setCacheError);
            }
        }
        return responseText;
    }
}