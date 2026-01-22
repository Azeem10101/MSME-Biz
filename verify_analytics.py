
import requests
import json

def test_analytics():
    print("--- Testing Analytics Format ---")
    try:
        res = requests.post('http://localhost:8000/process', json={
            "message": "Show me sales trends",
            "history": []
        })
        print(f"RAW BODY: {res.text}")
        data = res.json()
        
        intent = data.get('intent')
        answer = data.get('answer', '')
        stats = data.get('stats', {})
        
        print(f"INTENT: {intent}")
        print(f"ANSWER: {answer[:50]}...")
        print(f"STATS: {stats.keys()}")
        
        if intent == 'SUMMARY_QUERY' and 'total_sales' in stats:
            # Check answer content - should be the summary, NOT the list
            if "Here is your financial summary" in answer:
                print("PASS: Analytics format verified.")
                return
            else:
                print("FAIL: Answer text mismatch (got History mode?)")
        else:
            print("FAIL: Intent or Stats mismatch")
            
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")

if __name__ == "__main__":
    test_analytics()
