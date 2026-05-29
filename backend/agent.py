from langchain_groq import ChatGroq
from rag import find_related_events
from database import get_all_events
import os
from dotenv import load_dotenv
import json

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

def analyze_connections(event_text):
    """Agent that finds cause-effect connections between events"""
    
    # Step 1 — RAG: find related past events
    related = find_related_events(event_text, n=3)
    related_text = "\n".join([f"- {r}" for r in related])
    
    # Step 2 — Agent reasons over them
    prompt = f"""
    You are a geopolitical intelligence analyst.
    
    New event: {event_text}
    
    Related past events from our database:
    {related_text}
    
    Analyze the connections. Return ONLY a JSON object:
    {{
        "direct_causes": ["what directly caused this"],
        "connected_events": ["how this connects to past events"],
        "future_consequences": ["what might happen next globally"],
        "countries_at_risk": ["countries most affected"],
        "chain_summary": "one paragraph connecting all dots"
    }}
    
    Return only JSON. No extra text.
    """
    
    response = llm.invoke(prompt)
    raw = response.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    
    return json.loads(raw)

if __name__ == "__main__":
    test = "Iran closes Strait of Hormuz affecting global oil supply"
    
    print("🤖 Agent analyzing connections...\n")
    result = analyze_connections(test)
    print(json.dumps(result, indent=2))
