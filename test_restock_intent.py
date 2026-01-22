from assistant import MSMEAssistant
import json
from datetime import datetime

def test_restock():
    assistant = MSMEAssistant()
    # Test cases
    messages = [
        "Bought 50 milk packets for 2000",
        "Restocked 100 notebooks, cost 5000",
        "Refilled inventory with 20kg rice for 1200"
    ]
    
    print("Testing Restock Intent...")
    for msg in messages:
        print(f"\nUser: {msg}")
        result = assistant.process_message(msg, datetime.now().strftime("%Y-%m-%d"))
        print(f"Result: {json.dumps(result, indent=2)}")
        
        if result.get('intent') == 'STOCK_PURCHASE':
            print("PASS: Correctly classified as STOCK_PURCHASE")
        else:
            print(f"FAIL: Classified as {result.get('intent')}")

if __name__ == "__main__":
    test_restock()
