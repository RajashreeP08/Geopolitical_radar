from groq import Groq
import json
import os
from dotenv import load_dotenv
from database import init_db, save_event

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_geopolitical_data(article_text):

    prompt = f"""
    You are a geopolitical analyst. Read the following news article and extract structured information.
    
    Return ONLY a JSON object with exactly these fields:
    {{
        "event": "one line summary of what happened",
        "countries_involved": ["country1", "country2"],
        "cause": "what caused this event",
        "consequences": ["consequence1", "consequence2"],
        "category": "one of: trade / conflict / diplomacy / economy / military",
        "severity": a number from 1 to 10
    }}
    
    Article:
    {article_text}
    
    Return only the JSON. No explanation. No extra text.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()

    result = json.loads(raw)
    return result


if __name__ == "__main__":

    init_db()

    test_article = """
    India and China agreed to disengage troops from the remaining 
    friction points along the Line of Actual Control in eastern Ladakh. 
    The deal was brokered after months of diplomatic talks and signals 
    a significant de-escalation in the two-year border standoff. 
    Analysts say this could open doors for resumed trade between the two nations.
    """

    print("Sending article to Groq...")
    result = extract_geopolitical_data(test_article)
    print("\n✅ Extracted Data:")
    print(json.dumps(result, indent=2))

    save_event(result, raw_article=test_article)
    print("\n🧠 Saved to database!")