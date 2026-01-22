from assistant import MSMEAssistant
import json

def debug_exact_fail():
    assistant = MSMEAssistant()
    
    # Matching the user's screenshot context
    history = [
        # Assuming prior sales to reach 1100
        {"role": "user", "text": "sold items worth 1100"},
        {"role": "bot", "text": "Sale recorded.", "result": {
            "intent": "SALE_ENTRY",
            "date": "2026-01-15",
            "items": [],
            "total": 1100
        }},
        # The specific expense entry from the screenshot
        {"role": "user", "text": "paid 500rs debt today"},
        {"role": "bot", "text": "Data Extracted Successfully!", "result": {
            "intent": "EXPENSE_ENTRY",
            "date": "2026-01-15",
            "category": "debt",
            "amount": 500,
            "description": "paid debt today"
        }}
    ]
    
    # The failing query
    msg = "what's my total revenue today?"
    print(f"--- QUERY: {msg} ---")
    
    try:
        res = assistant.process_message(msg, "2026-01-15", history)
        print("\nRESULT:")
        print(json.dumps(res, indent=2))
        
        stats = res.get("stats", {})
        sales = stats.get("total_sales", 0)
        expenses = stats.get("total_expenses", 0)
        profit = stats.get("net_profit", 0)
        
        print(f"\nExpected Expenses: 500, Actual: {expenses}")
        print(f"Expected Profit: 600, Actual: {profit}")
        
    except Exception as e:
        print(f"\nEXCEPTION: {e}")

if __name__ == "__main__":
    debug_exact_fail()
