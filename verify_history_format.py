
import requests
import sqlite3
import json
from datetime import datetime

def test_history_format():
    print("--- Testing History Format ---")
    
    # 2. Query History
    try:
        res = requests.post('http://localhost:8000/process', json={
            "message": "Show me my recent history",
            "history": []
        })
        print(f"RAW BODY: {res.text}")
        
        data = res.json()
        print(f"INTENT: {data.get('intent')}")
        print(f"VIEW TYPE: {data.get('view_type')}")
        txs = data.get('transactions', [])
        print(f"TRANSACTIONS FOUND: {len(txs)}")
        
        if len(txs) > 0 and data.get('view_type') == 'list':
            print("PASS: Structured History format verified.")
        else:
            print("FAIL: Missing transactions or incorrect view_type")
            
    except Exception as e:
        print(f"JSON PARSE ERROR: {e}")

if __name__ == "__main__":
    test_history_format()
