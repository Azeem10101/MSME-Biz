import database
try:
    rows = database.get_all_transactions()
    print(f"Total rows: {len(rows)}")
    if rows:
        print("First row:", rows[0])
except Exception as e:
    print(f"Error: {e}")
