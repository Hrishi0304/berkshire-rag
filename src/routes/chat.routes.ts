import { FastifyInstance } from "fastify";
import { chatSchema } from "../schemas/chat.schema";
import { handleChat } from "../controllers/chat.controller";

export async function chatRoutes(fastify: FastifyInstance){
    fastify.post('/chat',{schema: chatSchema},handleChat);
}