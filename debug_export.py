from database import get_all_transactions

if __name__ == "__main__":
    try:
        rows = get_all_transactions()
        print(f"Success! Got {len(rows)} rows.")
        if rows:
            print(rows[0])
    except Exception as e:
        print(f"ERROR: {e}")
