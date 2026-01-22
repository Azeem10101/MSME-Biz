from assistant import MSMEAssistant
import json

def debug_show_numbers():
    assistant = MSMEAssistant()
    
    history = [
        {"role": "user", "text": "Sold 5 Bread for 40 each"},
        {"role": "bot", "text": "Quick Sale Recorded!", "result": {
            "intent": "SALE_ENTRY",
            "date": "2026-01-15",
            "items": [{"product_name": "Bread", "quantity": 5, "unit_price": 40}],
            "total": 200
        }}
    ]
    
    msg = "show me the numbers"
    print(f"--- QUERY: {msg} ---")
    
    try:
        res = assistant.process_message(msg, "2026-01-15", history)
        print("\nRESULT:")
        print(json.dumps(res, indent=2))
        
        if res.get("intent") == "UNKNOWN":
            print("\nFAILURE: Intent is UNKNOWN.")
        elif not res.get("stats"):
             print("\nFAILURE: stats missing.")
    except Exception as e:
        print(f"\nEXCEPTION: {e}")

if __name__ == "__main__":
    debug_show_numbers()
