import schedule
import time
import threading
from pipeline import run_pipeline
from database import cleanup_old_events

def job_every_4_hours():
    print("\n⏰ Scheduled run: fetching latest geopolitical news...")
    run_pipeline(
        query="war conflict sanctions diplomacy trade military",
        count=8
    )

def job_daily_cleanup():
    print("\n🧹 Daily cleanup: removing events older than 7 days...")
    cleanup_old_events(days=7)

def start_scheduler():
    # Run immediately on start
    job_every_4_hours()

    # Then every 4 hours
    schedule.every(4).hours.do(job_every_4_hours)

    # Cleanup once daily
    schedule.every().day.at("00:00").do(job_daily_cleanup)

    print("✅ Scheduler running — updates every 4 hours")

    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    start_scheduler()