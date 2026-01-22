import sqlite3
from datetime import datetime, timedelta

def seed_expenses():
    conn = sqlite3.connect('cms.db')
    cursor = conn.cursor()
    
    today = datetime.now()
    dates = [(today - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(5)]
    
    print(f"Injecting expenses for: {dates}")
    
    # Add expenses for last 5 days
    for date in dates:
        cursor.execute("INSERT INTO expenses (date, category, amount, description) VALUES (?, ?, ?, ?)", 
                       (date, 'Restock', 400, 'Daily supplies'))
                       
    conn.commit()
    conn.close()
    print("Expenses added.")

if __name__ == "__main__":
    seed_expenses()
