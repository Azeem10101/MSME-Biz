import requests

def verify_csv_export():
    print("--- Testing CSV Export ---")
    try:
        res = requests.get('http://localhost:8000/export/csv')
        
        if res.status_code == 200:
            print("SUCCESS: Downloaded CSV.")
            content = res.text
            lines = content.strip().split('\n')
            
            print(f"Total Lines: {len(lines)}")
            print("--- HEADERS ---")
            print(lines[0])
            print("--- FIRST ROW ---")
            if len(lines) > 1:
                print(lines[1])
            else:
                print("(No data rows)")
                
            # Verify headers
            if "Date,Type,Item/Category,Amount,Details" in lines[0].replace('\r', ''):
                print("\nVALIDATION INT: Headers match.")
            else:
                print("\nVALIDATION WARNING: Headers mismatch.")
                
        else:
            print(f"FAILURE: Status {res.status_code}")
            print(res.text)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_csv_export()
