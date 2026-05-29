# 🌍 Geopolitical Radar

A real-time AI-powered geopolitical intelligence platform that analyzes global news, extracts cause-effect relationships, and visualizes them on an interactive world map.

## Features
- 🤖 AI-powered news extraction using LLaMA 3.3 via Groq
- 🧠 RAG system using ChromaDB for semantic search
- 🕵️ Agentic AI that connects cause-effect chains across events
- 🌍 Interactive D3.js world map with real-time event markers
- 📡 Auto-fetches news every 4 hours from 10 geopolitical queries
- ⚡ FastAPI backend with REST API

## Tech Stack
- **Backend:** Python, FastAPI, SQLite, ChromaDB, LangChain
- **AI:** Groq API (LLaMA 3.3 70B), RAG, Agentic AI
- **Frontend:** React, D3.js, Framer Motion, Tailwind CSS
- **News:** NewsAPI

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env
# Add your API keys to .env
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Architecture
```
News Articles → AI Extraction → SQLite DB → RAG (ChromaDB)
                                               ↓
                              Agent connects cause-effect chains
                                               ↓
                         FastAPI serves data → React D3 World Map
```