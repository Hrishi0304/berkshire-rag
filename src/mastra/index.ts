import { Mastra } from '@mastra/core';
import { PgVector } from '@mastra/pg';
import { berkshireAgent } from './agents/berkshire-agent';

const pgVector = new PgVector({
  id: 'pgVector',
  connectionString: process.env.DATABASE_URL!,
});

export const mastra = new Mastra({
  agents: { berkshireAgent },
  vectors: { pgVector },
  server: {
    port: 4111,
  },
});


