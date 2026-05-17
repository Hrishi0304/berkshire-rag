import { groq } from '@ai-sdk/groq';

export const groqChat = groq('llama-3.3-70b-versatile');

export async function ollamaEmbed(texts: string[]): Promise<number[][]> {
  const response = await fetch('http://localhost:11434/api/embed', {
    method: 'POST',
    body: JSON.stringify({
      model: 'nomic-embed-text',
      input: texts,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Ollama embed failed: ${response.status} ${err}`);
  }

  const data = await response.json() as { embeddings: number[][] };
  return data.embeddings;
}