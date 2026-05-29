from news_fetcher import fetch_all_geopolitical_news, fetch_international_news
from Extractor import extract_geopolitical_data
from database import init_db, save_event
import time

def run_pipeline(query=None, count=5):
    """Full pipeline: fetch → extract → save"""
    print("🚀 Starting Geopolitical Radar pipeline...\n")
    init_db()

    # Use broad multi-query fetch if no specific query
    if query is None:
        articles = fetch_all_geopolitical_news(articles_per_query=2)
    else:
        articles = fetch_international_news(query, count=count)

    print(f"✅ Found {len(articles)} articles\n")

    if not articles:
        print("❌ No articles fetched. Check your NewsAPI key.")
        return

    success = 0
    skipped = 0

    for i, article in enumerate(articles):
        title = article.get('title', '')[:50]
        print(f"🔍 Processing {i+1}/{len(articles)}: {title}...")

        try:
            extracted = extract_geopolitical_data(article["text"])

            # Skip if no countries identified
            if not extracted.get('countries_involved'):
                print(f"   ⏭ Skipped — no countries identified\n")
                skipped += 1
                continue

            # Skip clearly irrelevant articles
            event_text = extracted.get('event', '').lower()
            skip_keywords = ['lawn mower', 'gardening', 'beauty product',
                           'celebrity', 'sports score', 'recipe', 'fashion week']
            if any(kw in event_text for kw in skip_keywords):
                print(f"   ⏭ Skipped — not geopolitical\n")
                skipped += 1
                continue

            # Skip very low severity non-political events
            severity = int(extracted.get('severity', 5))
            countries = extracted.get('countries_involved', [])
            if severity <= 2 and len(countries) <= 1:
                print(f"   ⏭ Skipped — low severity single country\n")
                skipped += 1
                continue

            extracted["source_url"] = article.get("url", "")
            extracted["published"] = article.get("published", "")

            save_event(extracted, raw_article=article["text"])

            print(f"   ✅ {extracted['event'][:60]}...")
            print(f"   🌍 {extracted['countries_involved']} | ⚡ {extracted['severity']}/10\n")
            success += 1

        except Exception as e:
            print(f"   ❌ Failed: {e}\n")

        time.sleep(0.5)

    print(f"✅ Pipeline complete!")
    print(f"   Saved: {success} | Skipped: {skipped} | Total: {len(articles)}")


if __name__ == "__main__":
    run_pipeline()