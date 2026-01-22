import pytest
import os
from assistant import MSMEAssistant

@pytest.fixture
def assistant():
    return MSMEAssistant()

def test_general_query_advice(assistant):
    message = "What is a good profit margin for a grocery store?"
    result = assistant.process_message(message, "2026-01-17")
    assert result["intent"] == "GENERAL_QUERY"
    assert len(result["answer"]) > 10

def test_general_query_definition(assistant):
    message = "What is GST?"
    result = assistant.process_message(message, "2026-01-17")
    assert result["intent"] == "GENERAL_QUERY"
    assert "tax" in result["answer"].lower() or "gst" in result["answer"].lower()

def test_general_unknown_fallback(assistant):
    # Depending on how broad GENERAL_QUERY is, this might now be GENERAL instead of UNKNOWN
    # But let's test a greeting to see if prompt handles it as GENERAL or UNKNOWN
    # The prompt says "GENERAL_QUERY", so "Hello" might be general query now if it answers "Hello! I can help you with..."
    message = "Hello, how do I save money?"
    result = assistant.process_message(message, "2026-01-17")
    assert result["intent"] == "GENERAL_QUERY"
    assert len(result["answer"]) > 5

if __name__ == "__main__":
    pytest.main([__file__])
