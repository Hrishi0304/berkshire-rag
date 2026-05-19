# 📈 Berkshire Hathaway Intelligence — RAG Agent

A sophisticated Retrieval-Augmented Generation (RAG) agent designed to analyze and answer complex questions about Warren Buffett's investment philosophy, business strategies, and financial metrics using historical Berkshire Hathaway annual shareholder letters (1977-2024).

This system is built using **Mastra** (an agentic framework), **Fastify** (a high-performance Node.js API server), **Neon Cloud PostgreSQL with pgvector** (for cloud vector storage and similarity search), **Hugging Face Serverless Inference API** (for cloud-based text embeddings), **Groq Cloud** (for fast cloud-based LLM reasoning), and **Upstash Redis** (for high-performance rate limiting and caching).

---

## 🛠️ Technical Stack

- **Primary Framework:** [Mastra](https://mastra.ai/)
- **API Server:** [Fastify](https://fastify.dev/)
- **Vector Database:** [Neon PostgreSQL with pgvector](https://neon.tech/) (Cloud vector database)
- **Cloud Embeddings:** [Hugging Face Serverless Inference API](https://huggingface.co/docs/api-inference/index) (using `sentence-transformers/all-MiniLM-L6-v2` - 384 dimensions)
- **LLM Provider:** [Groq Cloud](https://console.groq.com/) (using `llama-3.3-70b-versatile`)
- **Cache & Rate Limiting:** [Upstash Redis](https://upstash.com/) (Serverless Redis)
- **Language & Runtime:** TypeScript / Node.js (via `tsx`)

---

## ⚙️ Prerequisites & Setup

Unlike earlier versions of this project, you **no longer** need to install Docker or run local Ollama embedding models on your machine. All database, embedding, and LLM services are cloud-hosted for optimal speed, reliability, and ease of deployment.

### Required Software
1. **Node.js** (v18+ recommended)
2. **NPM** (or pnpm/yarn)

---

## 🔑 Environment Configuration

The application requires several API keys and connection strings to interact with the cloud services. A template file `.env.example` is provided in the project root.

### Step 1: Create your environment file
Copy the `.env.example` template to create your own `.env` file:
```bash
cp .env.example .env
```

### Step 2: Fill in the credentials
Open `.env` and configure the following variables:

```ini
# Server Port
PORT=3000

# PostgreSQL Vector Database
# Get a free connection string from Neon (https://neon.tech/) with pgvector pre-installed
DATABASE_URL=postgresql://<username>:<password>@<hostname>/<dbname>?sslmode=require

# LLM Provider - Groq Cloud API
# Generate a free, high-speed LLM key at Groq Console (https://console.groq.com/)
GROQ_API_KEY=your_groq_api_key_here

# Embeddings - Hugging Face Serverless Inference API Key
# Create a free API token in Hugging Face settings (https://huggingface.co/settings/tokens)
HF_API_KEY=your_hugging_face_api_key_here

# Cache & Storage - Upstash Redis
# Create a free serverless Redis database at Upstash Console (https://console.upstash.com/)
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url_here
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token_here
```

---

## 🚀 Quick Start Guide

Follow these step-by-step commands to get the Berkshire RAG application running on your local machine:

### 1. Install Dependencies
Install the required Node.js modules:
```bash
npm install
```

### 2. Configure Environment
Ensure your `.env` file is populated with valid keys as explained in the **Environment Configuration** section.

### 3. Add PDF letters to `/letters` folder
Create the `letters` directory if it does not exist, and copy your annual Berkshire Hathaway PDF shareholder letters (from 1977 to 2024, or a subset like 2019 to 2024) into it:
```bash
mkdir -p letters
```
*Ensure your PDFs (e.g., `2019.pdf`, `2020.pdf`, etc.) are placed inside the `/letters` folder.*

### 4. Run Ingestion Pipeline
Parse the PDF letters, chunk their contents, generate 384-dimensional embeddings via Hugging Face, and store them directly in your Neon Cloud Database:
```bash
npm run ingest
```
*Upon successful ingestion, you will see:*
```bash
✅ Ingestion complete!
```

### 5. Start the Fastify Server
Start the Fastify API server, which mounts the Mastra agent and exposes your chat endpoint:
```bash
npm run dev
```
- **Fastify Server:** Runs on `http://localhost:3000`
- **Fastify Chat API:** `http://localhost:3000/api/chat`
- **Mastra Agents endpoint:** `http://localhost:3000/api/agents`

### 6. Start the Mastra Studio Dashboard
In a **separate** terminal, start the Mastra visual developer playground:
```bash
npm run mastra:dev
```
- **Mastra Studio Dashboard:** Runs on `http://localhost:4111`
- **Mastra API:** `http://localhost:4111/api`

> [!NOTE]
> The Fastify server runs on `http://localhost:3000`, and the Mastra dev server is configured to run on `http://localhost:4111` to prevent port collisions. This configuration is defined in the `src/mastra/index.ts` file under the `server` block.

---

## 🤖 The Berkshire Hathaway Agent

The agent is defined in `src/mastra/agents/berkshire-agent.ts` with custom system instructions mirroring Warren Buffett's philosophy:

- **Core Expertise:** Grounded in Berkshire Hathaway annual letters.
- **Tone & Persona:** Knowledgeable financial analyst specializing in Buffett’s principles and strategies.
- **Constraints:** Quotes directly from letters with proper citations, stays transparent about knowledge boundaries, and provides year-specific details.

---

## 📂 Project Structure

```
├── .mastra/             # Auto-generated Mastra build outputs
├── letters/             # Place your Berkshire annual PDFs here (e.g. 1977-2024)
├── src/
│   ├── controllers/     # Route controller logic
│   ├── mastra/
│   │   ├── agents/      # Mastra Agent definitions (berkshire-agent.ts)
│   │   ├── index.ts     # Mastra initialization & PG configuration (Server Port 4111)
│   │   └── ollama.ts    # Groq LLM setup
│   ├── routes/          # Fastify route definitions (chat.routes.ts)
│   ├── schemas/         # Request validation schemas (chat.schema.ts)
│   ├── scripts/         # Ingestion scripts (ingest.ts using Hugging Face Embeddings)
│   ├── services/        # Business logic services
│   ├── utils/           # Shared API response and error utilities
│   └── server.ts        # Fastify main entry point (Server Port 3000, Cors, Rate-Limiting)
├── .env.example         # Environment template file
├── package.json         # NPM scripts and dependencies
└── tsconfig.json        # TypeScript configuration
```

---

## 💬 API Usage Example

You can query the Fastify chat endpoint with a POST request:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What did Warren Buffett say about interest rates in 2022?"}'
```

---

## 📬 Dataset & Contact

If you would like to request the historical Berkshire Hathaway annual letters dataset (1977-2024) prepared for ingestion, or have any questions about the data ingestion pipeline, feel free to reach out!

📧 **Email:** [hrishikesh.0304@gmail.com](mailto:hrishikesh.0304@gmail.com)

---
*Created by [Hrishikesh](https://github.com/hrishi0304) as part of the Backend Mastery learning journey.* ☕
