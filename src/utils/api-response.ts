import { FastifyReply } from "fastify";

export function sendSuccess(reply: FastifyReply, data: unknown, message: string, statusCode: number = 200) {
    return reply.status(statusCode).send({
        success: true,
        message: message,
        data: data
    });
}

export function sendError(reply: FastifyReply, message: string, statusCode: number = 500, errors?: unknown) {
    return reply.status(statusCode).send({
        success: false,
        message: message,
        errors: errors
    });
}