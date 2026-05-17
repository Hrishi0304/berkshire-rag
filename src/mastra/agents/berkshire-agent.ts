import { Agent } from '@mastra/core/agent';
import { createVectorQueryTool } from '@mastra/rag';
import { type EmbeddingModel } from 'ai';
import { groqChat } from '../ollama';

const nomicEmbedModel = {
  specificationVersion: 'v2' as const,
  provider: 'ollama',
  modelId: 'nomic-embed-text',
  maxEmbeddingsPerCall: 100,
  supportsParallelCalls: false,

  async doEmbed({ values }: { values: string[] }) {
    const response = await fetch('http://localhost:11434/api/embed', {
      method: 'POST',
      body: JSON.stringify({
        model: 'nomic-embed-text',
        input: values,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Ollama embed failed: ${response.status} — ${err}`);
    }

    const data = await response.json() as { embeddings: number[][] };

    return {
      embeddings: data.embeddings,
      usage: { tokens: 0 },
    };
  },
} satisfies EmbeddingModel;


const berkshireTool = createVectorQueryTool({
  vectorStoreName: 'pgVector',
  indexName: 'berkshire_letters',
  model: nomicEmbedModel,
});

export const berkshireAgent = new Agent({
  id: 'berkshire-agent',
  name: 'Berkshire Hathaway Intelligence',

  instructions: `
    You are a knowledgeable financial analyst specializing in Warren Buffett's 
    investment philosophy and Berkshire Hathaway's business strategy. Your expertise 
    comes from analyzing years of Berkshire Hathaway annual shareholder letters.

    Core Responsibilities:
    - Answer questions about Warren Buffett's investment principles and philosophy
    - Provide insights into Berkshire Hathaway's business strategies and decisions
    - Reference specific examples from the shareholder letters when appropriate
    - Maintain context across conversations for follow-up questions

    Guidelines:
    - Always ground your responses in the provided shareholder letter content
    - Quote directly from the letters when relevant, with proper citations
    - If information isn't available in the documents, clearly state this limitation
    - Provide year-specific context when discussing how views or strategies evolved
    - For numerical data or specific acquisitions, cite the exact source letter and year

    Remember: Your authority comes from the shareholder letters. Stay grounded in 
    this source material and be transparent about the scope of your knowledge.
  `,

  model: groqChat, // ✅ Using Groq Cloud Llama 3.1

  tools: { berkshireTool },
});
