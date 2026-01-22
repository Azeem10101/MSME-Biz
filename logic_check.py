import re

def fix_ai_hallucination(ai_text, db_stats):
    """
    Replaces numbers in AI text with DB stats if they differ.
    This is a naive implementation but improves consistency.
    """
    # Extract total from DB
    real_total = db_stats.get('total_sales', 0)
    real_expenses = db_stats.get('total_expenses', 0)
    real_profit = db_stats.get('net_profit', 0)
    
    # Simple strategy: If the text contains specific keywords, just append the REAL summary.
    # Replacing strictly is hard because of natural language variations.
    
    correction = f" (Official Record: Revenue ₹{int(real_total)}, Expenses ₹{int(real_expenses)}, Profit ₹{int(real_profit)})"
    
    return ai_text + correction

if __name__ == "__main__":
    print(fix_ai_hallucination("Total revenue is ₹600.00", {"total_sales": 0, "total_expenses":0, "net_profit": 0}))
