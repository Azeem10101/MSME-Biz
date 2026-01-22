from assistant import MSMEAssistant
import json

def debug_expense_logic():
    assistant = MSMEAssistant()
    
    # Simulate history: 1 Sale (800) + 1 Expense (500)
    history = [
        {"role": "user", "text": "Sold items for 800"},
        {"role": "bot", "text": "Sale recorded.", "result": {
            "intent": "SALE_ENTRY",
            "date": "2026-01-15",
            "items": [],
            "total": 800
        }},
        {"role": "user", "text": "paid off debt of 500"},
        {"role": "bot", "text": "Expense recorded.", "result": {
            "intent": "EXPENSE_ENTRY",
            "date": "2026-01-15",
            "category": "debt repayment",
            "amount": 500,
            "description": "paid off debt"
        }}
    ]
    
    msg = "what's the total revenue today?"
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
        print(f"Expected Profit: 300, Actual: {profit}")
        
        if expenses == 500 and profit == 300:
            print("SUCCESS: Expenses calculated correctly.")
        else:
            print("FAILURE: Calculation incorrect.")
            
    except Exception as e:
        print(f"\nEXCEPTION: {e}")

if __name__ == "__main__":
    debug_expense_logic()
