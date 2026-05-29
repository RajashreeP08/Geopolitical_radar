import chromadb
import os
from database import get_all_events
import json

RAG_PATH = os.path.join(os.path.dirname(__file__), 'chroma_db')

client = chromadb.PersistentClient(path=RAG_PATH)
collection = client.get_or_create_collection("geopolitical_events")

def index_all_events():
    """Load all DB events into ChromaDB vector store"""
    events = get_all_events()
    
    for event in events:
        text = f"{event['event']}. Cause: {event['cause']}. Countries: {', '.join(event['countries'])}"
        collection.upsert(
            documents=[text],
            ids=[str(event['id'])],
            metadatas=[{"countries": json.dumps(event['countries']), "severity": str(event['severity']), "category": event['category']}]
        )
    print(f"✅ Indexed {len(events)} events into RAG")

def find_related_events(query, n=3):
    """Find events semantically similar to a query"""
    results = collection.query(query_texts=[query], n_results=n)
    return results['documents'][0]

if __name__ == "__main__":
    index_all_events()
    
    print("\n🔍 Searching: 'US China trade conflict'")
    related = find_related_events("US China trade conflict")
    for i, r in enumerate(related):
        print(f"  {i+1}. {r[:100]}...")