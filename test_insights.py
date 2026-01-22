import pytest
from assistant import MSMEAssistant

@pytest.fixture
def assistant():
    return MSMEAssistant()

def test_top_product_intent(assistant):
    message = "What is my best selling item?"
    result = assistant.process_message(message, "2026-01-17")
    assert result["intent"] == "INSIGHT_QUERY"
    # AI might output "top_product", "best_product", "product" etc. My app.py checks for "product" in string.
    assert "product" in result["insight_type"].lower() or "item" in result["insight_type"].lower()

def test_top_customer_intent(assistant):
    message = "Who is my best customer?"
    result = assistant.process_message(message, "2026-01-17")
    assert result["intent"] == "INSIGHT_QUERY"
    assert "customer" in result["insight_type"].lower()

if __name__ == "__main__":
    pytest.main([__file__])
