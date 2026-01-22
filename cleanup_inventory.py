from database import get_db

def cleanup():
    conn = get_db()
    cursor = conn.cursor()
    
    items_to_remove = ['Milk (1L)', 'milk packets', 'test items', 'milk']
    
    print("Cleaning inventory...")
    for item in items_to_remove:
        cursor.execute("DELETE FROM inventory WHERE item_name = ?", (item,))
        if cursor.rowcount > 0:
            print(f"Removed: {item}")
        else:
            print(f"Not found: {item}")
            
    conn.commit()
    conn.close()
    print("Cleanup complete.")

if __name__ == "__main__":
    cleanup()
