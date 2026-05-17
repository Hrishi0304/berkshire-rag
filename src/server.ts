import Fastify, { FastifyError } from 'fastify';
import cors from '@fastify/cors';
import { MastraServer } from '@mastra/fastify';   // ✅ Key import
import { mastra } from './mastra/index.js';
import { chatRoutes } from './routes/chat.routes.js';
import { sendError } from './utils/api-response.js';
import { AppError } from './utils/api-error.js';

const fastify = Fastify({ logger: true });

await fastify.register(cors, { origin: '*' });

// ✅ Mount Mastra INSIDE your Fastify app
// This registers /api/agents, /api/workflows etc. on this same server
const mastraServer = new MastraServer({ app: fastify, mastra });
await mastraServer.init();

// ✅ Your own custom routes come AFTER mastra init
await fastify.register(chatRoutes, { prefix: '/api' });

fastify.setErrorHandler((error: FastifyError, request, reply) => {
  if (error.validation) {
    return sendError(reply, `Validation Error: ${error.message}`, 400);
  }
  if (error instanceof AppError) {
    return sendError(reply, error.message, error.statusCode);
  }
  fastify.log.error(error);
  return sendError(reply, 'Internal Server Error', 500);
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Fastify API:     http://localhost:${port}/api/chat`);
    console.log(`🤖 Mastra Agents:   http://localhost:${port}/api/agents`);
    console.log(`📊 Mastra Dashboard: run  npm run mastra:dev  separately`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();