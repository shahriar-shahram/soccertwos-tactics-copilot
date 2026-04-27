# SoccerTwos Tactical Copilot (AI Product)

An end-to-end deployed AI system for analyzing reinforcement learning gameplay in Unity ML-Agents SoccerTwos, combining replay inspection, retrieval-based reasoning, and grounded tactical insights.

---

## 🔗 Live Demo

- 🌐 Frontend (Vercel): https://soccertwos-tactics-copilot.vercel.app  
- ⚙️ Backend API (Render): https://soccertwos-copilot-api.onrender.com  
- 💻 GitHub: https://github.com/shahriar-shahram/azure-soccertwos-tactics-copilot  

---

## 🧠 Overview

This project turns RL-generated gameplay data into an interactive AI product.

It enables:

- replay-based match analysis  
- grounded tactical Q&A  
- structured inspection of RL behaviors  

Unlike typical ML projects, this system is **fully deployed** and designed as a real user-facing product.

---

## ⚙️ Core Features

### 🎮 Replay Analysis
- Match summary and scoreline  
- Event timeline  
- Embedded replay video  
- Tactical context  

### 🤖 Tactical Copilot (RAG)
- Ask natural-language questions  
- Retrieve relevant match events + tactical notes  
- Generate grounded answers based only on retrieved context  
- Display source snippets used for reasoning  

### 📊 Runs & Artifacts
- Browse training runs  
- Inspect model outputs  
- View experiment artifacts  

---

## 💡 Example Questions

- Why did blue win?  
- What was Orange's biggest mistake?  
- What tactical pattern mattered most?  
- Summarize this match in coaching language  

---

## 🏗️ System Architecture

```text
Unity ML-Agents (SoccerTwos)
        ↓
Match data + tactical notes + event chunks
        ↓
Local Retrieval Layer (RAG chunks)
        ↓
FastAPI Backend (Render)
        ↓
Grounded Answer Generation
        ↓
React Frontend (Vercel)
```

---

## 🧰 Tech Stack

### Frontend
- React + TypeScript  
- Vite  
- Tailwind CSS  

### Backend
- FastAPI  
- Python  
- Uvicorn  

### AI / System Design
- Retrieval-Augmented Generation (RAG)  
- Structured event indexing  
- Prompt-based grounded reasoning  

### Deployment
- Vercel (frontend)  
- Render (backend)  

### RL Context
- Unity ML-Agents  
- SoccerTwos  
- ONNX policy artifacts  

---

## 📁 Repository Structure

```text
azure-soccertwos-tactics-copilot/
├── backend/
│   ├── app/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── routes/
├── frontend/
├── data/
├── training/
└── docs/
```

---

## 🧪 Local Development

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For production, set:

```env
VITE_API_BASE_URL=https://soccertwos-copilot-api.onrender.com
```

---

## 📦 Sample Data

Includes:

- 1 demo match (`match_001`)  
- Tactical playbook  
- RAG chunks  
- Replay video  

---

## 🚀 Deployment

- Frontend → Vercel  
- Backend → Render  
- Retrieval → Local RAG chunks  

---

## 🎯 Why This Project Matters

This project demonstrates:

- building a **full-stack AI system**, not just models  
- connecting RL outputs to real user workflows  
- implementing a **retrieval + reasoning pipeline**  
- deploying a **live AI product**  

---

## ⚠️ Limitations

- Single demo match  
- Simplified retrieval (no embeddings yet)  
- Replay not fully synchronized with state  

---

## 🔮 Future Work

- vector embeddings (FAISS / cosine similarity)  
- multi-match indexing  
- richer replay controls  
- analytics dashboards  
- LangChain / agent integration  

---

## 👤 Author

Shahriar Shahram  
- GitHub: https://github.com/shahriar-shahram  
