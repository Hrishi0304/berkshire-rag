import { mastra } from "../mastra";
import { AppError } from "../utils/api-error";
import { tryCatch } from "../utils/try-catch";

export class ChatService {
    static async generateResponse(prompt: string): Promise<string>{
        const [result,error] = await tryCatch(mastra.getAgent('berkshireAgent').generate(prompt));

        if(error){
            console.log('Mastra Error: ',error);
            throw new AppError('The AI agent failed to process your request. ', 500);
        }

        return result.text;
    }
}