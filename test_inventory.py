import requests
import json
import time

URL = "http://localhost:8000/process"

def test_inventory_flow():
    # 1. Restock (or create item)
    print("--- Restocking Milk ---")
    payload_restock = {
        "message": "We got 20 packets of milk",
        "current_date": "2026-01-16"
    }
    res = requests.post(URL, json=payload_restock)
    print(res.json().get('answer'))

    # 2. Sell (Deduct Stock)
    print("\n--- Selling 5 Milk ---")
    payload_sell = {
        "message": "Sold 5 milk",
        "current_date": "2026-01-16"
    }
    requests.post(URL, json=payload_sell)
    
    # 3. Check Warning (Stock should be 15, no warning)
    # We trigger a dummy update to see current stock or rely on the sale answer
    # Ideally, we can query inventory, but we haven't built a specific query intent yet.
    # We'll rely on the "Low Stock" warning appearing when we sell MORE.
    
    # 4. Sell to Trigger Low Stock (Sell 12 more -> Stock 3)
    print("\n--- Selling 12 More Milk (Should Trigger Low Stock) ---")
    payload_sell_more = {
        "message": "Sold 12 milk",
        "current_date": "2026-01-16"
    }
    res = requests.post(URL, json=payload_sell_more)
    answer = res.json().get('answer', '')
    print("Bot Answer:", answer)
    
    if "Low Stock Alert" in answer and "milk (3.0)" in answer:
        print("\nSUCCESS: Low Stock Alert triggered correctly.")
    else:
        print("\nFAILURE: Low Stock Alert missing.")

if __name__ == "__main__":
    time.sleep(2)
    test_inventory_flow()
