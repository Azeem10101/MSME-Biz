import database
import io
import csv

try:
    rows = database.get_all_transactions()
    output = io.StringIO()
    writer = csv.writer(output, lineterminator='\r\n', quoting=csv.QUOTE_ALL)
    writer.writerow(['Date', 'Type', 'Item/Category', 'Amount', 'Details'])
    for row in rows:
        writer.writerow([
            str(row.get('date', '')), 
            str(row.get('type', '')), 
            str(row.get('item', '')), 
            str(row.get('amount', '')), 
            str(row.get('details', ''))
        ])
    print("--- START CSV ---")
    print(output.getvalue()[:1000]) # Print first 1000 chars
    print("--- END CSV ---")
except Exception as e:
    print(f"Error: {e}")
