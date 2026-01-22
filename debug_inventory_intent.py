from assistant import MSMEAssistant
import json

def debug_intent():
    assistant = MSMEAssistant()
    
    msg = "Sold 12 milk"
    print(f"--- MSG: {msg} ---")
    
    res = assistant.process_message(msg, "2026-01-16")
    print("\nRESULT:")
    print(json.dumps(res, indent=2))

if __name__ == "__main__":
    debug_intent()
