import sys
import json
from datetime import datetime
from assistant import MSMEAssistant

def main():
    print("=== MSME AI Business Assistant ===")
    print("Parsing informal, multilingual messages into structured JSON.")
    print("Type 'exit' to quit.")
    print("-" * 35)

    assistant = MSMEAssistant()
    current_date = datetime.now().strftime("%Y-%m-%d")

    while True:
        try:
            message = input("\nUser message: ")
            if message.lower() in ["exit", "quit"]:
                break
            
            if not message.strip():
                continue

            result = assistant.process_message(message, current_date)
            print("\nExtracted Data:")
            print(json.dumps(result, indent=2, ensure_ascii=False))
            
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
