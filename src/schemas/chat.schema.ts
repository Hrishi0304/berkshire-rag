export const chatSchema = {
    body: {
        type: 'object',
        required: ['message'],
        properties: {
            message: {
                type: 'string',
                minLength: 1
            }
        }
    }
}

export type ChatInput = {
    message: string
}