import sqlite3
import json
import os

# This creates the database file automatically if it doesn't exist
DB_PATH = os.path.join(os.path.dirname(__file__), 'geopolitical.db')

def init_db():
    """Create the events table if it doesn't exist"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event TEXT NOT NULL,
            countries TEXT NOT NULL,
            cause TEXT,
            consequences TEXT,
            category TEXT,
            severity INTEGER,
            raw_article TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Database ready")

def save_event(extracted_data, raw_article=""):
    """Save one extracted event to the database — skip if duplicate"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Check if very similar event already exists
    cursor.execute('''
        SELECT id FROM events 
        WHERE event = ? OR 
        (countries = ? AND date(created_at) = date('now'))
    ''', (
        extracted_data['event'],
        json.dumps(extracted_data['countries_involved'])
    ))
    
    existing = cursor.fetchone()
    if existing:
        print(f"   ⏭ Duplicate skipped: {extracted_data['event'][:40]}")
        conn.close()
        return

    cursor.execute('''
        INSERT INTO events 
        (event, countries, cause, consequences, category, severity, raw_article)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        extracted_data['event'],
        json.dumps(extracted_data['countries_involved']),
        extracted_data['cause'],
        json.dumps(extracted_data['consequences']),
        extracted_data['category'],
        extracted_data['severity'],
        raw_article
    ))

    conn.commit()
    conn.close()
    print(f"✅ Saved: {extracted_data['event'][:50]}")

def get_all_events():
    """Fetch all saved events — no duplicates"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM events 
        GROUP BY event
        ORDER BY created_at DESC
    ''')
    rows = cursor.fetchall()
    conn.close()

    events = []
    for row in rows:
        events.append({
            'id': row[0],
            'event': row[1],
            'countries': json.loads(row[2]),
            'cause': row[3],
            'consequences': json.loads(row[4]),
            'category': row[5],
            'severity': row[6],
            'created_at': row[8]
        })
    return events
# TEST
if __name__ == "__main__":
    init_db()
    
    # Fake data to test saving
    test_event = {
        "event": "US imposes 100% tariff on Chinese EVs",
        "countries_involved": ["United States", "China"],
        "cause": "Ongoing trade war escalation",
        "consequences": ["Chinese retaliation", "Supply chain disruption"],
        "category": "trade",
        "severity": 8
    }
    
    save_event(test_event, raw_article="Test article text here")
    
    print("\n📦 All events in database:")
    all_events = get_all_events()
    for e in all_events:
        print(f"  → [{e['id']}] {e['event']} | {e['countries']} | severity: {e['severity']}")

def cleanup_old_events(days=7):
    """Remove events older than X days"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        DELETE FROM events 
        WHERE created_at < datetime('now', ?)
    ''', (f'-{days} days',))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()
    print(f"🧹 Cleaned up {deleted} old events")

def get_recent_events(hours=168):
    """Get events from last X hours only"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM events 
        ORDER BY created_at DESC
        LIMIT 100
    ''')
    rows = cursor.fetchall()
    conn.close()

    events = []
    for row in rows:
        events.append({
            'id': row[0],
            'event': row[1],
            'countries': json.loads(row[2]),
            'cause': row[3],
            'consequences': json.loads(row[4]),
            'category': row[5],
            'severity': row[6],
            'created_at': row[8]
        })
    return events      