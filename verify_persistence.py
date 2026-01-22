import requests
import json
import time

URL = "http://localhost:8000/process"

def verify_persistence_after_restart():
    print("\n--- Querying Stats After Restart ---")
    payload_query = {
        "message": "how much did i sell?",
        "current_date": "2026-01-15"
    }
    
    try:
        res = requests.post(URL, json=payload_query)
        data = res.json()
        stats = data.get('stats', {})
        print("Stats from DB:", stats)
        
        # We expect at least the 500 from the previous run
        if stats.get('total_sales', 0) >= 500:
            print("SUCCESS: Data persisted across restart!")
        else:
            print("FAILURE: Data lost.")
            
    except Exception as e:
        print(f"Failed to connect: {e}")

if __name__ == "__main__":
    time.sleep(2)
    verify_persistence_after_restart()
