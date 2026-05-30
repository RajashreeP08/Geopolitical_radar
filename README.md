# 🌍 Geopolitical Radar

> Real-time AI-powered geopolitical intelligence platform that monitors global news, extracts cause-effect relationships using Agentic AI, and visualizes them on a cinematic interactive world map.

🔴 **Live Demo:** [geopolitical-radar-green.vercel.app](https://geopolitical-radar-green.vercel.app)

![Geopolitical Radar](https://img.shields.io/badge/Status-Live-brightgreen) ![Python](https://img.shields.io/badge/Python-3.12-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688) ![LangChain](https://img.shields.io/badge/LangChain-0.3-121212)

---

## 🎯 What it does

- **Ingests** live geopolitical news every 4 hours from 10 topic-specific queries
- **Extracts** structured intelligence (event, countries, cause, consequences, severity) using LLaMA 3.3 70B
- **Stores** events in SQLite with semantic indexing via ChromaDB (RAG)
- **Connects** cause-effect chains across events using an Agentic AI system
- **Visualizes** everything on a cinematic D3.js world map with real-time animations

---

## 🖥️ Screenshots

### World Map — Live Event Markers
Countries light up with severity-coded pulse animations. Click any marker to begin analysis.

### Country Intelligence Briefing
Side panel shows all active events for a selected country with threat level indicators.

### News Event Analysis
Click any event to see nations involved (color-coded by role), root cause, and consequences.

### Deep Intelligence Analysis
AI agent connects the event to past events, identifies countries at risk, and projects future consequences.

---

## 🧠 AI Architecture
News Articles (NewsAPI)
↓
LLaMA 3.3 70B via Groq API
↓ (Prompt Engineering)
Structured JSON Extraction
{event, countries, cause, consequences, category, severity}
↓
SQLite Database + ChromaDB Vector Store (RAG)
↓
LangChain Agent (ReAct Pattern)
↓ (Semantic Search across past events)
Cause-Effect Chain Analysis
↓
FastAPI REST Endpoints
↓
React + D3.js World Map

---

## ⚡ Key Features

- 🤖 **Generative AI** — LLaMA 3.3 70B extracts geopolitical intelligence from raw news
- 🧠 **RAG System** — ChromaDB stores article embeddings for semantic similarity search
- 🕵️ **Agentic AI** — LangChain agent autonomously connects cause-effect chains across events
- 🌍 **Cinematic Map** — D3.js world map with animated arcs, pulse rings, country flags
- 📡 **Auto-refresh** — News fetched every 4 hours from 10 geopolitical query categories
- ⚡ **Real-time** — Live intelligence feed, clock, event counter in HUD
- 🎨 **War room UI** — JetBrains Mono + Space Grotesk, glassmorphism panels, scanline effects

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **AI Model** | LLaMA 3.3 70B via Groq API |
| **Agent Framework** | LangChain + LangChain-Groq |
| **Vector Database** | ChromaDB |
| **Backend** | FastAPI + Python |
| **Database** | SQLite |
| **News Source** | NewsAPI |
| **Frontend** | React + Vite |
| **Map** | D3.js + TopoJSON |
| **Animations** | Framer Motion |
| **Styling** | Tailwind CSS |
| **Backend Deploy** | Railway |
| **Frontend Deploy** | Vercel |

---

## 🚀 Run Locally

### Prerequisites
- Python 3.12+
- Node.js 18+
- Groq API key (free at console.groq.com)
- NewsAPI key (free at newsapi.org)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
# source venv/bin/activate    # Mac/Linux
pip install -r requirements.txt
cp .env.example .env
# Add your API keys to .env
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Fetch Initial News
```bash
cd backend
py pipeline.py
```

### Auto-scheduler (updates every 4 hours)
```bash
cd backend
py scheduler.py
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/events` | Get recent geopolitical events |
| GET | `/events/all` | Get all events |
| GET | `/analyze?event=...` | Agent analysis of an event |
| POST | `/fetch-news` | Trigger news pipeline |
| GET | `/status` | System health check |

---

## 🌍 How RAG Works in This Project

Every processed article is converted into a vector embedding and stored in ChromaDB. When the agent analyzes a new event, it semantically searches past events to find related ones — enabling it to build cause-effect chains across hundreds of articles automatically.

Example chain:
Russia-Ukraine conflict
→ Global wheat supply disruption
→ Food price inflation in Middle East
→ Political instability in Egypt
→ US diplomatic pressure

---

## 🎓 What I Learned Building This

- How to call and prompt LLMs via API for structured data extraction
- Building RAG pipelines with ChromaDB and semantic search
- Designing agentic AI systems using LangChain's ReAct pattern
- Creating REST APIs with FastAPI
- Building interactive data visualizations with D3.js
- Deploying full-stack AI applications on Railway + Vercel

---

## 📁 Project Structure
geopolitical_radar/
├── backend/
│   ├── Extractor.py      #AI news extraction
│   ├── database.py       # SQLite operations
│   ├── news_fetcher.py   # NewsAPI integration
│   ├── pipeline.py       # Full processing pipeline
│   ├── rag.py            # ChromaDB vector store
│   ├── agent.py          # LangChain agent
│   ├── scheduler.py      # Auto-refresh scheduler
│   ├── main.py           # FastAPI app
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── WorldMap.jsx
│       │   ├── CountryPanel.jsx
│       │   └── NewsDetailPanel.jsx
│       └── pages/
│           ├── MapPage.jsx
│           └── AnalysisPage.jsx
└── README.md

---

## 👤 Author

**Rajashree Patel**
- GitHub: [@RajashreeP08](https://github.com/RajashreeP08)

---

⭐ Star this repo if you found it interesting!