import requests
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))

NEWS_API_KEY = os.getenv("NEWSAPI_KEY")

GEOPOLITICAL_QUERIES = [
    "war conflict military",
    "sanctions diplomacy treaty",
    "US China Russia geopolitics",
    "nuclear weapons missile",
    "trade war tariffs",
    "Israel Iran Middle East",
    "NATO Ukraine ceasefire",
    "coup protest government crisis",
    "oil energy supply",
    "terrorism insurgency"
]

def fetch_international_news(query="geopolitics", count=5):
    url = "https://newsapi.org/v2/everything"

    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": count,
        "apiKey": NEWS_API_KEY
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()

        if data.get("status") != "ok":
            print(f"  ⚠ NewsAPI: {data.get('message', 'unknown error')}")
            return []

        articles = []
        for article in data.get("articles", []):
            if not article.get("content") or not article.get("description"):
                continue
            if article.get("title") == "[Removed]":
                continue

            full_text = f"""
            Title: {article['title']}
            Source: {article['source']['name']}
            Published: {article['publishedAt']}
            Description: {article['description']}
            Content: {article['content']}
            """
            # Skip non-geopolitical articles
            skip_keywords = ['lawn mower', 'market report', 'beauty', 
                              'recipe', 'celebrity', 'gardening', 'fashion']
            title_lower = article.get('title', '').lower()
            if any(kw in title_lower for kw in skip_keywords):
                continue

            articles.append({
                "text": full_text,
                "source": article["source"]["name"],
                "url": article["url"],
                "published": article["publishedAt"],
                "title": article["title"]
            })

        return articles

    except Exception as e:
        print(f"  ⚠ Fetch error: {e}")
        return []


def fetch_all_geopolitical_news(articles_per_query=2):
    all_articles = []
    seen_titles = set()

    for query in GEOPOLITICAL_QUERIES:
        print(f"  Querying: '{query}'...")
        articles = fetch_international_news(query, count=articles_per_query)
        for article in articles:
            title = article.get("title", "")
            if title not in seen_titles:
                seen_titles.add(title)
                all_articles.append(article)

    print(f"✅ Fetched {len(all_articles)} unique articles from {len(GEOPOLITICAL_QUERIES)} queries")
    return all_articles


if __name__ == "__main__":
    print("Testing NewsAPI connection...\n")
    articles = fetch_international_news("geopolitics war", count=3)
    if articles:
        for a in articles:
            print(f"✅ {a['title'][:60]}")
            print(f"   {a['source']} | {a['published'][:10]}\n")
    else:
        print("❌ No articles returned — check API key")