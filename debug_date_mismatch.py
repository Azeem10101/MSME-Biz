import sqlite3
from datetime import datetime

def debug_db_dates():
    conn = sqlite3.connect('cms.db')
    cursor = conn.cursor()
    
    print(f"Current System Date: {datetime.now().strftime('%Y-%m-%d')}")
    
    print("\n--- Sales Table ---")
    cursor.execute("SELECT id, date, total FROM sales")
    rows = cursor.fetchall()
    for row in rows:
        print(f"ID: {row[0]}, Date: {row[1]}, Total: {row[2]}")
        
    print("\n--- Expenses Table ---")
    cursor.execute("SELECT id, date, amount FROM expenses")
    rows = cursor.fetchall()
    for row in rows:
        print(f"ID: {row[0]}, Date: {row[1]}, Amount: {row[2]}")
        
    conn.close()

if __name__ == "__main__":
    debug_db_dates()
