import pytest
import os
from assistant import MSMEAssistant

@pytest.fixture
def assistant():
    # Make sure to set GEMINI_API_KEY in environment or pass it here
    return MSMEAssistant()

def test_sale_entry_hinglish(assistant):
    message = "Aaj 5 notebooks bechi 50 rupaye ki ek"
    result = assistant.process_message(message, "2026-01-11")
    assert result["intent"] == "SALE_ENTRY"
    assert len(result["items"]) == 1
    assert "notebook" in result["items"][0]["product_name"].lower()
    assert result["items"][0]["quantity"] == 5
    assert result["items"][0]["unit_price"] == 50
    assert result["total"] == 250

def test_expense_entry_hindi(assistant):
    message = "आज किराने पर 500 खर्च किए"
    result = assistant.process_message(message, "2026-01-11")
    assert result["intent"] == "EXPENSE_ENTRY"
    assert result["amount"] == 500
    # Accept Devanagari, English or Transliterated versions
    cat = str(result["category"]).lower()
    assert any(x in cat for x in ["किराना", "किराने", "grocer", "suppl", "kirana", "kirane"])

def test_inventory_update_english(assistant):
    message = "Add 20 notebooks to stock"
    result = assistant.process_message(message, "2026-01-11")
    assert result["intent"] == "INVENTORY_UPDATE"
    assert "notebook" in result["item"].lower()
    assert result["quantity_change"] == 20

def test_summary_query(assistant):
    message = "Show total sales from Jan 1 to Jan 10"
    result = assistant.process_message(message, "2026-01-11")
    assert result["intent"] == "SUMMARY_QUERY"
    assert "sale" in result["metric"].lower()
    assert result["start_date"] == "2024-01-01" or result["start_date"] == "2026-01-01" # Handle Jan 1 format
    assert "01-10" in result["end_date"]

def test_unknown_intent(assistant):
    message = "Hello how are you?"
    result = assistant.process_message(message, "2026-01-11")
    assert result["intent"] == "UNKNOWN"
    assert "message" in result

if __name__ == "__main__":
    # If running directly, execute tests manually or with pytest
    pytest.main([__file__])
