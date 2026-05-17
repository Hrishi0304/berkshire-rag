# 📈 Berkshire Hathaway Intelligence — RAG Agent

A sophisticated Retrieval-Augmented Generation (RAG) agent designed to analyze and answer complex questions about Warren Buffett's investment philosophy, business strategies, and financial metrics using historical Berkshire Hathaway annual shareholder letters (1977-2024).

This system is built using **Mastra** (an agentic framework), **Fastify** (a high-performance Node.js API server), **pgvector** (for vector storage and similarity search), **Ollama** (for local text embeddings), and **Groq** (for fast cloud-based LLM reasoning).

---

## 🛠️ Technical Stack

- **Primary Framework:** [Mastra](https://mastra.ai/)
- **API Server:** [Fastify](https://fastify.dev/)
- **Vector Database:** [PostgreSQL with pgvector](https://github.com/pgvector/pgvector)
- **Local Embeddings:** [Ollama](https://ollama.com/) (using `nomic-embed-text`)
- **LLM Provider:** [Groq Cloud](https://console.groq.com/) (using `llama-3.3-70b-versatile`)
- **Language & Runtime:** TypeScript / Node.js (via `tsx`)

---

## ⚙️ Prerequisites

Before running this project, you must have the following installed on your machine:

1. **Docker & Docker Compose** (for running the pgvector database)
2. **Node.js** (v18+ recommended)
3. **Ollama** (for running local text embeddings)

### 🧠 Embedding Model Setup (Ollama)
To run the ingestion pipeline, download local Ollama and fetch the embedding model:

1. [Download and install Ollama](https://ollama.com/).
2. Start Ollama on your machine.
3. Open a terminal and run the following command to download the required embedding model:
   ```bash
   ollama pull nomic-embed-text
   ```

---

## 🚀 Quick Start Guide

Follow these step-by-step commands to get the Berkshire RAG application running on your local machine:

### 1. Install Dependencies
Install the required node modules:
```bash
npm install
```

### 2. Start pgvector Database
Spin up a fresh PostgreSQL container with the `pgvector` extension enabled (make sure no conflicting services are on port `5432`):
```bash
npm run docker:up
```
*Wait ~10 seconds for the database container to become healthy and ready for connections.*

### 3. Add PDF letters to `/letters` folder
Create the `letters` directory if it does not exist, and copy your annual Berkshire Hathaway PDF shareholder letters (from 2019 to 2024) into it:
```bash
# Create the directory
mkdir -p letters
```
*Ensure your PDFs (e.g., `2019.pdf`, `2020.pdf`, etc.) are placed inside the `/letters` folder.*

### 4. Run Ingestion Pipeline
Embed all PDF letters and ingest the vectorized chunks into PostgreSQL:
```bash
npm run ingest
```
*Upon successful ingestion, you will see:*
```bash
✅ All letters ingested!
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
In a **SEPARATE** terminal, start the Mastra visual developer playground:
```bash
npm run mastra:dev
```
- **Mastra Studio Dashboard:** Runs on `http://localhost:4111`
- **Mastra API:** `http://localhost:4111/api`

> [!NOTE]
> Since the Fastify server runs on `http://localhost:3000`, the Mastra dev server is configured to run on `http://localhost:4111` to prevent port collisions. This configuration is defined in the `src/mastra/index.ts` file under the `server` block.

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
│   ├── mastra/
│   │   ├── agents/      # Mastra Agent definitions (berkshire-agent.ts)
│   │   ├── index.ts     # Mastra initialization & PG configuration (Server Port 4111)
│   │   └── ollama.ts    # Custom Ollama embedder & Groq LLM setup
│   ├── routes/          # Fastify route definitions (chat.routes.ts)
│   ├── scripts/         # Ingestion scripts (ingest.ts)
│   ├── utils/           # Shared API response and error utilities
│   └── server.ts        # Fastify main entry point (Server Port 3000)
├── docker-compose.yml   # PostgreSQL + pgvector configuration
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
