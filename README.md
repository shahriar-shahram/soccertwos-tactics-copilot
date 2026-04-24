# Azure SoccerTwos Tactics Copilot

An interactive AI product project that combines reinforcement learning match analysis, replay review, and grounded tactical question answering for Unity ML-Agents SoccerTwos.

## Live Demo

- Frontend: https://azure-soccertwos-tactics-copilot.vercel.app
- Backend API: https://soccertwos-copilot-api.onrender.com
- GitHub: https://github.com/shahriar-shahram/azure-soccertwos-tactics-copilot

## Overview

This project turns SoccerTwos training artifacts and replay summaries into a lightweight coaching and analysis product.

It includes:

- a React/Vite frontend for replay viewing, runs browsing, and copilot interaction
- a FastAPI backend for match loading, run inspection, and grounded Q&A
- Azure AI Search for retrieval over tactical notes, match summaries, and indexed event chunks
- Azure OpenAI for final grounded answer generation
- a replay page with an embedded demo clip and event timeline
- a runs page for experiment artifacts and model outputs

The current version uses a curated demonstration match and tactics notes to showcase the full product flow.

## Core Features

- **Replay analysis**
  - Match summary
  - Scoreline and metadata
  - Event timeline
  - Embedded replay video

- **Grounded tactics copilot**
  - Ask natural-language questions about a match
  - Retrieve relevant tactical notes and event chunks from Azure AI Search
  - Generate grounded answers with Azure OpenAI
  - Display source snippets used for the answer

- **Runs and artifacts view**
  - Inspect training runs and stored outputs
  - Browse available experiment artifacts

## Example Questions

- Why did blue win?
- What was Orange's biggest mistake?
- What tactical pattern mattered most?
- Summarize this match in coaching language.

## System Architecture

```text
Unity SoccerTwos / RL artifacts / replay summaries
                |
                v
        Data + tactical notes + event chunks
                |
                v
         Azure AI Search (retrieval layer)
                |
                v
    FastAPI backend on Render (application layer)
                |
                v
     Azure OpenAI (grounded answer generation)
                |
                v
      React/Vite frontend on Vercel (UI layer)
```

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- FastAPI
- Python
- Uvicorn

### AI / Cloud
- Azure AI Search
- Azure OpenAI
- Render
- Vercel

### RL / Simulation Context
- Unity ML-Agents
- SoccerTwos
- ONNX model artifacts

## Repository Structure

```text
azure-soccertwos-tactics-copilot/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   └── requirements.txt
├── frontend/                 # React/Vite frontend
│   ├── public/
│   │   └── replays/
│   └── src/
├── data/
│   ├── processed/
│   │   └── matches/
│   └── rag_chunks/
├── docs/
│   └── playbooks/
├── training/
│   └── results/
└── Dockerfile.backend
```

## Local Development

### 1) Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Environment Variables

### Backend
Create `backend/.env` with:

```env
AZURE_OPENAI_ENDPOINT=https://eastus.api.cognitive.microsoft.com/
AZURE_OPENAI_API_KEY=YOUR_AZURE_OPENAI_KEY
AZURE_OPENAI_CHAT_DEPLOYMENT=soccer-chat

AZURE_SEARCH_ENDPOINT=https://srch-soccertwos-shahriar.search.windows.net
AZURE_SEARCH_API_KEY=YOUR_AZURE_SEARCH_KEY
AZURE_SEARCH_INDEX_NAME=soccer-rag-index

AZURE_STORAGE_ACCOUNT=stsoccertwosshahriar
AZURE_STORAGE_CONTAINER=rag-docs

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend
Set:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For production, this points to the hosted backend.

## Sample Data Included

The deployed demo currently includes:

- one seeded match:
  - `match_001`
- one tactical playbook:
  - `basic_tactics.md`
- generated RAG chunks used for retrieval
- one replay video attached to the demo match

## Deployment

### Frontend
Hosted on **Vercel**.

### Backend
Hosted on **Render**.

### Retrieval / Generation
- Azure AI Search for retrieval
- Azure OpenAI for grounded answer generation

## Why This Project Matters

This project was built to demonstrate a practical AI product workflow around RL-generated behavior:

- converting experiment outputs into a user-facing product
- connecting replay review with grounded Q&A
- combining retrieval and LLM generation in a real application
- shipping a working cloud-based interface instead of only offline notebooks or training code

## Current Limitations

- The replay experience currently uses a recorded demo clip rather than full synchronized state playback
- The demo is centered on a curated seeded match instead of a full match database
- The runs page is lightweight and can be expanded with richer experiment metadata and plots

## Future Improvements

- multi-match indexing and search
- richer replay controls with synchronized event stepping
- automatic ingestion of new match summaries and trajectories
- better run comparison dashboards
- policy-level analytics and failure-mode summaries
- more robust deployment packaging for all artifacts

## Author

Shahriar Shahram

- GitHub: https://github.com/shahriar-shahram
