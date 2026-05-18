import { MDocument } from '@mastra/rag';
import { createOpenAI } from '@ai-sdk/openai';
import { PgVector } from '@mastra/pg';
import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse';

// ✅ Hugging Face Serverless Inference API — 100% Free Cloud Embeddings
async function embedTexts(texts: string[]): Promise<number[][]> {
  const response = await fetch(
    'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: texts,
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Hugging Face embed API failed: ${response.status} — ${err}`);
  }

  return await response.json() as number[][];
}

async function ingestLetters() {
  const pgVector = new PgVector({
    id: 'pgVector',
    connectionString: process.env.DATABASE_URL!,
  });

  console.log('📦 Resetting vector index...');
  try { 
    await pgVector.deleteIndex({ indexName: 'berkshire_letters' });
    console.log('   🗑️  Old index deleted');
  } catch (e) { 
    console.log('   ℹ️  No existing index to delete');
  }

  await pgVector.createIndex({
    indexName: 'berkshire_letters',
    dimension: 384,   // sentence-transformers/all-MiniLM-L6-v2 = 384 dims
    buildIndex: false,
  });
  console.log('   ✅ Fresh index created');

  const lettersDir = path.join(process.cwd(), 'letters');
  const files = fs.readdirSync(lettersDir).filter(f => f.endsWith('.pdf'));
  console.log(`\n📄 Found ${files.length} letter(s) to process...`);

  for (const file of files) {
    const filePath = path.join(lettersDir, file);
    const year = file.match(/\d{4}/)?.[0] ?? 'unknown';

    console.log(`\n📖 Processing: ${file} (Year: ${year})`);

    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);

    const doc = MDocument.fromText(data.text, { source: file, year });
    const chunks = await doc.chunk({
      strategy: 'recursive',
      maxSize: 512,
      overlap: 100,
    });
    console.log(`   📝 Split into ${chunks.length} chunks`);

    // ✅ Using native Ollama /api/embed — no AI SDK version conflicts!
    const embeddings = await embedTexts(chunks.map(c => c.text));
    console.log(`   🔢 Generated ${embeddings.length} embeddings`);

    await pgVector.upsert({
      indexName: 'berkshire_letters',
      vectors: embeddings,
      metadata: chunks.map(c => ({
        text: c.text,
        source: file,
        year,
      })),
    });
    console.log(`   💾 Stored in PostgreSQL!`);
  }

  console.log('\n✅ Ingestion complete!');
  await pgVector.disconnect();
  process.exit(0);
}

ingestLetters().catch(err => {
  console.error('❌ Ingestion failed:', err.message);
  process.exit(1);
});