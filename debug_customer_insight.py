from assistant import MSMEAssistant
import json

def debug_customer_insight():
    assistant = MSMEAssistant()
    
    # Simulate history with named customers
    history = [
        {"role": "user", "text": "Sold 5 bread to Ramesh for 200"},
        {"role": "bot", "text": "Sale recorded.", "result": {
            "intent": "SALE_ENTRY",
            "date": "2026-01-15",
            "items": [],
            "total": 200,
            "customer_name": "Ramesh"
        }},
        {"role": "user", "text": "Sold 10 milk to Suresh for 600"},
        {"role": "bot", "text": "Sale recorded.", "result": {
            "intent": "SALE_ENTRY",
            "date": "2026-01-15",
            "items": [],
            "total": 600,
            "customer_name": "Suresh"
        }},
        {"role": "user", "text": "Sold 2 bread to Ramesh for 80"},
        {"role": "bot", "text": "Sale recorded.", "result": {
            "intent": "SALE_ENTRY",
            "date": "2026-01-15",
            "items": [],
            "total": 80,
            "customer_name": "Ramesh"
        }}
    ]
    
    # Query for best customer
    msg = "who is my most profiting customer?"
    print(f"--- QUERY: {msg} ---")
    
    try:
        res = assistant.process_message(msg, "2026-01-15", history)
        print("\nRESULT:")
        print(json.dumps(res, indent=2))
        
        answer = res.get("answer", "").lower()
        if "suresh" in answer:
            print("\nSUCCESS: Identified Suresh as top customer.")
        elif "ramesh" in answer:
            print("\nFAILURE: Identified Ramesh (wrong total).")
        else:
             print("\nFAILURE: Did not identify any customer.")
            
    except Exception as e:
        print(f"\nEXCEPTION: {e}")

if __name__ == "__main__":
    debug_customer_insight()
