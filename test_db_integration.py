import requests
import json
import time

URL = "http://localhost:8000/process"

def test_db_persistence():
    # 1. Add a Sale
    print("--- Adding Sale ---")
    payload_sale = {
        "message": "Sold 10 test items for 50",
        "current_date": "2026-01-15"
    }
    try:
        res = requests.post(URL, json=payload_sale)
        print(f"Sale Response: {res.status_code}")
        print(json.dumps(res.json(), indent=2))
    except Exception as e:
        print(f"Failed to connect: {e}")
        return

    # 2. Query Stats (Should reflect DB data)
    print("\n--- Querying Stats ---")
    payload_query = {
        "message": "show me the numbers",
        "current_date": "2026-01-15"
    }
    res = requests.post(URL, json=payload_query)
    data = res.json()
    stats = data.get('stats', {})
    print("Stats from DB:", stats)
    
    if stats.get('total_sales') >= 500: # 10*50
        print("SUCCESS: DB captured the sale.")
    else:
        print("FAILURE: DB did not capture the sale.")

if __name__ == "__main__":
    time.sleep(2) # Wait for server boot
    test_db_persistence()
