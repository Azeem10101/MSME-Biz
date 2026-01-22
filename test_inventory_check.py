import pytest
from assistant import MSMEAssistant

@pytest.fixture
def assistant():
    return MSMEAssistant()

def test_check_specific_stock(assistant):
    # This should ideally be a query, but might be UNKNOWN or wrongly classified as UPDATE
    message = "How much milk do I have?"
    result = assistant.process_message(message, "2026-01-17")
    
    # We expect this to FAIL or be UNKNOWN in current system
    # If it maps to INVENTORY_UPDATE, it might try to add/remove 0 stock?
    print(f"Intent classified as: {result['intent']}")
    
    # Ideally we want a new intent type for this
    assert result['intent'] == "INVENTORY_QUERY"

def test_inventory_value(assistant):
    message = "What is the total value of my inventory?"
    result = assistant.process_message(message, "2026-01-17")
    print(f"Intent classified as: {result['intent']}")
    # Now this should map to INVENTORY_QUERY with no item_name, which triggers valuation
    assert result['intent'] == "INVENTORY_QUERY"

if __name__ == "__main__":
    pytest.main([__file__])
