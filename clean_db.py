import sqlite3

def clean_db():
    conn = sqlite3.connect('cms.db')
    cursor = conn.cursor()
    
    # Remove debug items
    cursor.execute("DELETE FROM inventory WHERE item_name = 'debug_milk'")
    print("Deleted debug_milk")
    
    # Optional: Reset milk to a reasonable number if user wants, 
    # but for now we won't touch their 'real' data unless asked.
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    clean_db()
