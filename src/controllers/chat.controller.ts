import { FastifyReply, FastifyRequest } from "fastify";
import { ChatInput } from "../schemas/chat.schema";
import { tryCatch } from "../utils/try-catch";
import { ChatService } from "../services/chat.service";
import { sendSuccess } from "../utils/api-response";

export async function handleChat(
    request: FastifyRequest<{Body: ChatInput}>,
    reply: FastifyReply
){
    const { message } = request.body;

    const [answer, error] = await tryCatch(ChatService.generateResponse(message));

    if(error) throw error;

    return sendSuccess(reply,{answer},'Response generated successfully');
}