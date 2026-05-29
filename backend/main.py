from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from database import get_all_events, get_recent_events, init_db
from agent import analyze_connections
from pipeline import run_pipeline
import threading

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
def startup():
    init_db()
    # Auto-fetch news on startup in background
    thread = threading.Thread(target=run_pipeline, daemon=True)
    thread.start()

@app.get("/events")
def get_events():
    # Try recent 48 hours first
    events = get_recent_events(hours=48)
    
    # If no recent events, try 7 days
    if not events:
        events = get_recent_events(hours=168)
    
    # If still nothing, return ALL events (fallback)
    if not events:
        events = get_all_events()
    
    print(f"📦 Serving {len(events)} events")
    return events

@app.get("/events/all")
def get_all():
    return get_all_events()

@app.get("/events/recent")
def get_recent(hours: int = 24):
    events = get_recent_events(hours=hours)
    if not events:
        events = get_all_events()
    return events

@app.get("/analyze")
def analyze(event: str):
    return analyze_connections(event)

@app.post("/fetch-news")
def fetch_news(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_pipeline)
    return {"status": "fetching in background"}

@app.get("/status")
def status():
    all_events = get_all_events()
    recent = get_recent_events(hours=24)
    return {
        "total_events": len(all_events),
        "last_24h": len(recent),
        "status": "live"
    }